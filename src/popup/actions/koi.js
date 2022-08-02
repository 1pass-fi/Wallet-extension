import React from 'react'
import { useSelector } from 'react-redux'
import { SET_KOI } from 'actions/types'
import { TYPE } from 'constants/accountConstants'
// constants
import { FILENAME,MESSAGES } from 'constants/koiConstants'
// modules
import { find,get, isEmpty, isNumber } from 'lodash'
import { popupAccount } from 'services/account'
// services
import {
  popupBackgroundConnect as backgroundConnect,
  popupBackgroundRequest as backgroundRequest} from 'services/request/popup'
import { EventHandler as CreateEventHandler } from 'services/request/src/backgroundConnect'
import storage from 'services/storage'

import { setAccounts } from './accounts'
import { setActivatedChain } from './activatedChain'
import { setActivities } from './activities'
import { setAssets } from './assets'
import { setCreateWallet } from './createWallet'
import { setDefaultAccount } from './defaultAccount'
import { setError } from './error'
// actions
import { setIsLoading } from './loading'

export const getBalances = () => async (dispatch) => {
  const getBalanceSuccessHandler = new CreateEventHandler(
    MESSAGES.GET_BALANCES_SUCCESS,
    async (response) => {
      try {
        const accountStates = await popupAccount.getAllMetadata()
        dispatch(setAccounts(accountStates))
      } catch (err) {
        console.log(err.message)
        dispatch(setError(err.message))
      }
    }
  )
  backgroundConnect.addHandler(getBalanceSuccessHandler)
  backgroundConnect.postMessage({
    type: MESSAGES.GET_BALANCES
  })
}

/**
 * @param {String} key Wallet key or Seed phrase
 * @param {String} password Input password
 * @param {String} type Wallet type from constants/accountConstants
 * @returns {Void}
 */
export const importWallet = (key, password, type) => async (dispatch) => {
  try {
    await backgroundRequest.wallet.importWallet({ key, password, type })
    await popupAccount.loadImported()
    const accountsData = await popupAccount.getAllMetadata()

    dispatch(setAccounts(accountsData))
    dispatch(getBalances())
  } catch (err) {
    dispatch(setError(err.message))
  }
}

// TODO LongP - remove unused method(s)
export const removeWallet = (address, type) => async (dispatch, getState) => {
  try {
    await backgroundRequest.wallet.removeWallet({ address })

    await popupAccount.loadImported() // update accounts list for popupAccount
    const accountStates = await popupAccount.getAllMetadata()
    dispatch(setAccounts(accountStates))

    /* 
      Have to handle removing this address from activatedAccount if this
      address is the activated account.
    */
    const { defaultAccount, activatedChain } = getState()

    if (accountStates.length === 0) {
      await storage.setting.set.activatedArweaveAccountAddress(null)
      await storage.setting.set.activatedEthereumAccountAddress(null)
      await storage.setting.set.activatedChain(null)
    } else {
      const arAccount = find(accountStates, (v) => v.type === TYPE.ARWEAVE)
      const ethAccount = find(accountStates, (v) => v.type === TYPE.ETHEREUM)

      if (type === activatedChain) {
        if (type === TYPE.ARWEAVE) {
          if (address === defaultAccount.AR?.address) {
            if (!isEmpty(arAccount)) {
              dispatch(setDefaultAccount(arAccount))
            } else {
              await storage.setting.set.activatedArweaveAccountAddress(null)

              dispatch(setActivatedChain(TYPE.ETHEREUM))
              await storage.setting.set.activatedChain(TYPE.ETHEREUM)
            }
          }
        }
        if (type === TYPE.ETHEREUM) {
          if (address === defaultAccount.ETH?.address) {
            if (!isEmpty(ethAccount)) {
              dispatch(setDefaultAccount(ethAccount))
            } else {
              await storage.setting.set.activatedEthereumAccountAddress(null)

              dispatch(setActivatedChain(TYPE.ARWEAVE))
              await storage.setting.set.activatedChain(TYPE.ARWEAVE)
            }
          }
        }
      } else {
        if (type === TYPE.ARWEAVE) {
          const totalArweaveAccounts = await popupAccount.count(TYPE.ARWEAVE)
          if (totalArweaveAccounts) {
            if (address === defaultAccount.AR?.address) {
              if (!isEmpty(arAccount)) {
                dispatch(setDefaultAccount(arAccount))
              } else {
                await storage.setting.set.activatedArweaveAccountAddress(null)
              }
            }
          }
        }

        if (type === TYPE.ETHEREUM) {
          const totalEthereumAccounts = await popupAccount.count(TYPE.ETHEREUM)
          if (totalEthereumAccounts) {
            if (address === defaultAccount.ETH?.address) {
              if (!isEmpty(ethAccount)) {
                dispatch(setDefaultAccount(ethAccount))
              } else {
                await storage.setting.set.activatedEthereumAccountAddress(null)
              }
            }
          }
        }
      }
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
    })

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.NETWORK_CHANGED })
    })

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.CHAIN_CHANGED })
    })

    const { activities } = getState()
    const newActivities = activities.filter((activity) => activity.address !== address)

    dispatch(setActivities(newActivities))
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const lockWallet = () => async (dispatch) => {
  try {
    await backgroundRequest.wallet.lockWallet()
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const unlockWallet = (password) => async (dispatch) => {
  try {
    await backgroundRequest.wallet.unlockWallet({ password })
    dispatch(getBalances())
    return true
  } catch (err) {
    dispatch(setError(err.message))
    return
  }
}

/*
  Stage 1 of creating new wallet. Generate new seed phrase.
*/
export const generateWallet = (inputData) => async (dispatch) => {
  try {
    const { stage, password, walletType } = inputData

    dispatch(setIsLoading(true))

    const { seedPhrase } = await backgroundRequest.wallet.generateWallet({ walletType, password })
    dispatch(setCreateWallet({ seedPhrase, stage, password }))
  } catch (err) {
    dispatch(setError(err.message))
  }
}

/*
  Stage 3 of creating new wallet. Save wallet data to chrome storage:
    - Encrypted password
    - Encrypted seed phrase
    - Address
  Get balances.
*/
export const saveWallet = (seedPhrase, password, walletType) => async (dispatch) => {
  try {
    await backgroundRequest.wallet.saveWallet({ seedPhrase, password, walletType })
    const allData = await popupAccount.getAllMetadata()
    dispatch(setAccounts(allData))
    dispatch(setIsLoading(false))

    /* 
      Need to handle saving encrypted seedphrase
    */

    setCreateWallet({ stage: 1, password: null, seedPhrase: null })
    // We will move setCreateWallet() to the UI since now we can await for the action from UI code.
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const clearContent = (type) => async (dispatch) => {
  try {
    const allAccounts = await popupAccount.getAllAccounts()
    let allAssets = []

    allAssets = await Promise.all(
      allAccounts.map(async (account) => {
        let assets
        const accountMetadata = await account.get.metadata()
        if (accountMetadata.type === type) {
          await account.set.assets([])
          assets = []
        } else {
          assets = (await account.get.assets()) || []
        }

        return { owner: accountMetadata.address, contents: assets }
      })
    )
    dispatch(setAssets(allAssets))
  } catch (error) {
    dispatch(setError(err.message))
  }
}

export const loadContent = () => async (dispatch) => {
  try {
    const allAccounts = await popupAccount.getAllAccounts()
    let allAssets = []

    allAssets = await Promise.all(
      allAccounts.map(async (account) => {
        const assets = (await account.get.assets()) || []
        const address = await account.get.address()

        return { owner: address, contents: assets }
      })
    )
    dispatch(setAssets(allAssets))

    await backgroundRequest.assets.loadAllContent()
    // update state
    allAssets = await Promise.all(
      allAccounts.map(async (account) => {
        const assets = (await account.get.assets()) || []
        const address = await account.get.address()

        return { owner: address, contents: assets }
      })
    )
    dispatch(setAssets(allAssets))
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const loadActivities = (cursor, address) => async (dispatch, getState) => {
  try {
    let allActivities
    let { offset, limit } = cursor

    if (address === 'all') {
      allActivities = await storage.generic.get.allActivities()
    } else {
      const account = await popupAccount.getAccount({ address })
      allActivities = await account.get.activities()
    }

    const activitiesList = allActivities.slice(offset, offset + limit - 1)
    offset = offset + limit

    let { activities } = getState()

    const newActivities = await Promise.all(
      activities.map(async (activity) => {
        if (get(activity, 'account.address') === address) {
          const activitiesItems = [...activity.activityItems, ...activitiesList]
          activity.activityItems = activitiesItems
          const doneLoading = !activitiesList.length
          activity.cursor = { offset, limit, doneLoading }
        }

        return activity
      })
    )

    console.log('New Activities: ', newActivities)

    dispatch(setActivities(newActivities))
  } catch (err) {
    console.log('ERROR', err.message)
    dispatch(setError(err.message))
  }
}

export const makeTransfer = (sender, qty, target, token) => async (dispatch) => {
  try {
    const { address } = sender

    if (token == 'KOII') token = 'KOI' // On the SDK the name of token KOII has not been updated. (still KOI)

    const { txId, receipt } = await backgroundRequest.wallet.makeTransfer({
      qty,
      target,
      token,
      address
    })

    console.log('TRANSACTION res', { txId, receipt })
    return { txId, receipt }
  } catch (err) {
    console.log('ERROR-ACTION: ', err.message)
    throw new Error(err.message)
  }
}

export const signTransaction = (inputData) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const { isUpdate, isCreate } = inputData

    if (isUpdate) {
      await backgroundRequest.gallery.updateDID(inputData.tx)
    } else if (isCreate) {
      await backgroundRequest.gallery.createDID(inputData.tx)
    } else {
      await backgroundRequest.wallet.signTransaction(inputData)
    }

    window.close()
  } catch (err) {
    window.close()
  }
}

export const getKeyFile = (password, address) => async (dispatch) => {
  try {
    let { key } = await backgroundRequest.wallet.getKeyFile({ password, address })
    const type = await popupAccount.getType(address)

    let filename
    switch (type) {
      case TYPE.ARWEAVE:
        filename = FILENAME.ARWEAVE
        break
      case TYPE.ETHEREUM:
        filename = FILENAME.ETHEREUM

      // TODO DatH - LongP
    }

    const result = JSON.stringify(key)

    const url = 'data:application/json;base64,' + btoa(result)
    chrome.downloads.download({
      url: url,
      filename: filename
    })
  } catch (err) {
    throw new Error(err.message)
  }
}

export const connectSite = (inputData) => async (dispatch) => {
  try {
    await backgroundRequest.wallet.connect(inputData)
    window.close()
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const changeAccountName = (address, newName) => async (dispatch) => {
  try {
    await backgroundRequest.wallet.changeAccountName({ address, newName })

    const allData = await popupAccount.getAllMetadata()
    dispatch(setAccounts(allData))
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const setKoi = (payload) => ({ type: SET_KOI, payload })

export const updateEthereumProvider = (ethereumProvider) => async (dispatch) => {
  try {
    await backgroundRequest.gallery.updateEthereumProvider({ ethereumProvider })
  } catch (error) {
    dispatch(setError(err.message))
  }
}

export const updateSolanaProvider = (solanaProvider) => async (dispatch) => {
  try {
    await backgroundRequest.gallery.updateSolanaProvider({ solanaProvider })
  } catch (error) {
    dispatch(setError(err.message))
  }
}

export const updateK2Provider = (k2Provider) => async (dispatch) => {
  try {
    await backgroundRequest.gallery.updateK2Provider({ k2Provider })
  } catch (error) {
    dispatch(setError(err.message))
  }
}
