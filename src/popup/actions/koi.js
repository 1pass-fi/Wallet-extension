import { get, isString, isArray } from 'lodash'
import passworder from 'browser-passworder'

import { setIsLoading } from './loading'
import { setContLoading } from './continueLoading'
import { setError } from './error'
import { setCreateWallet } from './createWallet'
import { setAssets } from './assets'
import { setActivities } from './activities'
import { setTransactions } from './transactions'
import { setCursor } from './cursor'
import { clearActivities } from './activities'

import backgroundConnect, { CreateEventHandler } from './backgroundConnect'

import { MESSAGES, PATH, STORAGE, REQUEST, NOTIFICATION, PORTS, ALL_NFT_LOADED } from 'koiConstants'

import { SET_KOI } from 'actions/types'
import { getChromeStorage, removeChromeStorage, setChromeStorage, generateWallet as generateWalletUtil, saveWalletToChrome } from 'utils'
import { utils } from 'utils'
import { setNotification } from './notification'

import { koi } from 'background'
import moment from 'moment'
import { backgroundRequest } from 'popup/backgroundRequest'

export const getBalances = () => (dispatch) => {
  const getBalanceSuccessHandler = new CreateEventHandler(MESSAGES.GET_BALANCES_SUCCESS, async response => {
    const { koiData } = response.data
    console.log('UPDATE BALANCES. KOI: ', koiData.koiBalance, '; AR: ', koiData.arBalance)
    dispatch(setKoi(koiData))
  })
  backgroundConnect.addHandler(getBalanceSuccessHandler)
  backgroundConnect.postMessage({
    type: MESSAGES.GET_BALANCES
  })
}

/**
 * @param {String} key Wallet key or Seed phrase
 * @param {String} password Input password
 * @returns {Void}
 */
export const importWallet = (key, password) => async (dispatch) => {
  try {
    const response = await backgroundRequest.wallet.importWallet({key, password})
    const koiData = response.koiData
    console.log('IMPORT_WALLET_SUCCESS---', koiData)
    dispatch(setKoi(koiData))
    dispatch(getBalances())
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const removeWallet = () => async (dispatch) => {
  try {
    const { koiData } = await backgroundRequest.wallet.removeWallet()
    dispatch(setAssets([]))
    dispatch(setTransactions([]))
    dispatch(clearActivities())
    dispatch(setCursor({ ownedCursor: null, recipientCursor: null, doneLoading: false }))
    dispatch(setKoi(koiData))
    dispatch(setIsLoading(false))
  } catch (err) {
    dispatch(setError(err.message))
  }
}


export const lockWallet = () => async (dispatch) => {
  try {
    const { koiData } = await backgroundRequest.wallet.lockWallet()
    dispatch(setKoi(koiData))
  } catch (err) {
    dispatch(setError(err.message))
  }
}


export const unlockWallet = (password) => async (dispatch) => {
  try {
    const { koiData } = await backgroundRequest.wallet.unlockWallet({ password })
    dispatch(setKoi(koiData))
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
    const { stage, password } = inputData

    dispatch(setIsLoading(true))
    const seedPhrase = await generateWalletUtil(koi)
    const encryptedKey = await passworder.encrypt(password, koi.wallet)
    await setChromeStorage({ 'createdWalletAddress': koi.address, 'createdWalletKey': encryptedKey })
    dispatch(setCreateWallet({ seedPhrase, stage, password }))
    dispatch(setIsLoading(false))
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

/*
  Stage 3 of creating new wallet. Save wallet data to chrome storage:
    - Encrypted password
    - Encrypted seed phrase
    - Address
  Get balances.
*/
export const saveWallet = (seedPhrase, password) => async (dispatch) => {
  try {
    const { koiData } = backgroundRequest.wallet.saveWallet({seedPhrase, password})
    dispatch(setKoi(koiData))
    dispatch(getBalances())
    dispatch(setIsLoading(false))
    const encryptedSeedPhrase = await passworder.encrypt(password, seedPhrase)
    setChromeStorage({ 'koiPhrase': encryptedSeedPhrase })
    setCreateWallet({ stage: 1, password: null, seedPhrase: null })
    // We will move setCreateWallet() to the UI since now we can await for the action from UI code.
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const loadContent = () => async (dispatch) => {
  try {
    const { contentList } = await backgroundRequest.assets.loadContent()
    if (isArray(contentList)) dispatch(setAssets(contentList))
    if (contentList == ALL_NFT_LOADED) return ALL_NFT_LOADED
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const loadActivities = (cursor) => async (dispatch) => {
  /*
    the sdk will require cursors for the next request if we want to receive next set of activities (pagination).
  */
  try { 
    const { activitiesList, 
      nextOwnedCursor: ownedCursor, 
      nextRecipientCursor: recipientCursor } = await backgroundRequest.activities.loadActivities({ cursor })

    let pendingTransactions = (await utils.getChromeStorage(STORAGE.PENDING_TRANSACTION))[STORAGE.PENDING_TRANSACTION] || []
    
    // filtering accepted pending transactions
    pendingTransactions = pendingTransactions.filter(tx => {
      return activitiesList.every(activity => activity.id !== tx.id)
    })
    await utils.setChromeStorage({ pendingTransactions })
    dispatch(setTransactions(pendingTransactions))

    // set new cursor for next request
    dispatch(setCursor({ ownedCursor, recipientCursor }))
    !(activitiesList.length) && dispatch(setCursor({ doneLoading: true }))

    dispatch(setActivities(activitiesList))
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const makeTransfer = (qty, target, currency) => async (dispatch) => {
  try {
    const { txId } = await backgroundRequest.wallet.makeTransfer({qty, target, currency})

    const storage = await getChromeStorage(STORAGE.PENDING_TRANSACTION)

    // Add new pending transaction
    const pendingTransactions = storage[STORAGE.PENDING_TRANSACTION] || []
    const newTransaction = {
      id: txId,
      activityName: (currency === 'KOI' ? 'Sent KOI' : 'Sent AR'),
      expense: qty,
      accountName: 'Account 1',
      date: moment().format('MMMM DD YYYY'),
      source: target
    }
    pendingTransactions.unshift(newTransaction)
    await setChromeStorage({ pendingTransactions })
    dispatch(setTransactions(pendingTransactions))

    console.log('TRANSACTION ID', txId)
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const signTransaction = (inputData) => (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const signSuccessHandler = new CreateEventHandler(MESSAGES.SIGN_TRANSACTION_SUCCESS, response => {
      dispatch(setIsLoading(false))
      window.close()
    })
    const signFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
      window.close()
    })
    backgroundConnect.addHandler(signSuccessHandler)
    backgroundConnect.addHandler(signFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.SIGN_TRANSACTION,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const getKeyFile = (password) => async (dispatch) => {
  try {
    const { key } = await backgroundRequest.wallet.getKeyFile({ password })
    const filename = 'arweave-key.json'
    const result = JSON.stringify(key)

    const url = 'data:application/json;base64,' + btoa(result)
    chrome.downloads.download({
      url: url,
      filename: filename,
    })
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const connectSite = (inputData) => (dispatch) => {
  try {
    const connectSuccessHandler = new CreateEventHandler(MESSAGES.CONNECT_SUCCESS, response => {
      window.close()
    })
    const connectFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR 1===')
      const errorMessage = response.data
      dispatch(setError(errorMessage))
      window.close()
    })
    backgroundConnect.addHandler(connectSuccessHandler)
    backgroundConnect.addHandler(connectFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.CONNECT,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const setKoi = (payload) => ({ type: SET_KOI, payload })
