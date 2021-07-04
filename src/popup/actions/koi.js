import { get, isString } from 'lodash'
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

import { MESSAGES, PATH, STORAGE, REQUEST, NOTIFICATION, PORTS } from 'koiConstants'

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
    console.log(key, password)
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
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}


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

export const saveWallet = (inputData) => (dispatch) => {
  try {
    const { seedPhrase, history, password } = inputData
    dispatch(setIsLoading(true))
    const saveSuccessHandler = new CreateEventHandler(MESSAGES.SAVE_WALLET_SUCCESS, async response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      const encryptedSeedPhrase = await passworder.encrypt(password, seedPhrase)
      setChromeStorage({ 'koiPhrase': encryptedSeedPhrase })
      setCreateWallet({ stage: 1, password: null, seedPhrase: null })
      if ((await getChromeStorage(STORAGE.PENDING_REQUEST))[STORAGE.PENDING_REQUEST]) {
        history.push(PATH.CONNECT_SITE)
      } else {
        history.push(PATH.CREATE_WALLET_REDIRECT)
      } 
    })
    const saveFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(saveSuccessHandler)
    backgroundConnect.addHandler(saveFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.SAVE_WALLET,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const loadContent = () => (dispatch) => {
  try {
    dispatch(setContLoading(true))
    const loadSuccessHandler = new CreateEventHandler(MESSAGES.LOAD_CONTENT_SUCCESS, response => {
      const { contentList } = response.data
      console.log('CONTENT LIST FROM ACTION', contentList)
      if (contentList) dispatch(setAssets(contentList))
      dispatch(setContLoading(false))
    })
    const loadFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setContLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(loadSuccessHandler)
    backgroundConnect.addHandler(loadFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.LOAD_CONTENT,
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setContLoading(false))
  }
}

export const loadActivities = (inputData) => async (dispatch) => {
  try { 
    const loadSuccessHandler = new CreateEventHandler(MESSAGES.LOAD_ACTIVITIES_SUCCESS, async response => {
      
      const { activitiesList, nextOwnedCursor: ownedCursor, nextRecipientCursor: recipientCursor } = response.data
      let pendingTransactions = (await utils.getChromeStorage(STORAGE.PENDING_TRANSACTION))[STORAGE.PENDING_TRANSACTION] || []

      pendingTransactions = pendingTransactions.filter(tx => {
        return activitiesList.every(activity => activity.id !== tx.id)
      })
      await utils.setChromeStorage({ pendingTransactions })
      
      dispatch(setTransactions(pendingTransactions))
      dispatch(setCursor({ ownedCursor, recipientCursor }))
      !(activitiesList.length) && dispatch(setCursor({ doneLoading: true }))
      dispatch(setActivities(activitiesList))
    })
    const loadFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(loadSuccessHandler)
    backgroundConnect.addHandler(loadFailedHandler)
    await backgroundConnect.postMessage({
      type: MESSAGES.LOAD_ACTIVITIES,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
  }
}

export const makeTransfer = (inputData) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const transferSuccessHandler = new CreateEventHandler(MESSAGES.MAKE_TRANSFER_SUCCESS, async response => {
      const { txId, qty, address, currency } = response.data
      const storage = await getChromeStorage(STORAGE.PENDING_TRANSACTION)
      const pendingTransactions = storage[STORAGE.PENDING_TRANSACTION] || []
      const newTransaction = {
        id: txId,
        activityName: (currency === 'KOI' ? 'Sent KOI' : 'Sent AR'),
        expense: qty,
        accountName: 'Account 1',
        date: moment().format('MMMM DD YYYY'),
        source: address
      }
      pendingTransactions.unshift(newTransaction)
      await setChromeStorage({ pendingTransactions })
      dispatch(setTransactions(pendingTransactions))
      dispatch(setIsLoading(false))
      console.log('TRANSACTION ID', txId)
      dispatch(setNotification(`Transaction sent.`))
    })
    const transferFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })
    backgroundConnect.addHandler(transferSuccessHandler)
    backgroundConnect.addHandler(transferFailedHandler)
    await backgroundConnect.postMessage({
      type: MESSAGES.MAKE_TRANSFER,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
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

export const getKeyFile = (inputData) => (dispatch) => {
  try {
    const getKeyFileSuccessHandler = new CreateEventHandler(MESSAGES.GET_KEY_FILE_SUCCESS, response => {
      const content = response.data
      const filename = 'arweave-key.json'
      const result = JSON.stringify(content)

      const url = 'data:application/json;base64,' + btoa(result)
      chrome.downloads.download({
        url: url,
        filename: filename,
      })
      dispatch(setNotification(NOTIFICATION.KEY_EXPORTED))
    })
    backgroundConnect.addHandler(getKeyFileSuccessHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.GET_KEY_FILE,
      data: inputData
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

export const test = (data) => {
  return new Promise((resolve, reject) => {
    backgroundConnect.request(MESSAGES.TEST, response => {
      resolve(response)

      if (response.error) {
        reject(response.error)
      }
    }, data)
  })
}

export const setKoi = (payload) => ({ type: SET_KOI, payload })
