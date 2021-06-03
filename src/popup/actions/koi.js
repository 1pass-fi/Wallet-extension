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

import backgroundConnect, { CreateEventHandler } from './backgroundConnect'

import { MESSAGES, PATH, STORAGE, REQUEST, NOTIFICATION } from 'koiConstants'

import { SET_KOI } from 'actions/types'
import { getChromeStorage, removeChromeStorage, setChromeStorage, generateWallet as generateWalletUtil, saveWalletToChrome } from 'utils'
import { setNotification } from './notification'

import { koi } from 'background'
import moment from 'moment'

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

export const importWallet = (inputData) => (dispatch) => {
  try {
    const { data, password } = inputData
    dispatch(setIsLoading(true))
    const { history, redirectPath } = inputData
    const importSuccessHandler = new CreateEventHandler(MESSAGES.IMPORT_WALLET_SUCCESS, async response => {
      const { koiData } = response.data
      console.log('IMPORT_WALLET_SUCCESS---', koiData)
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      /* istanbul ignore next */
      if (isString(data)) {
        const encryptedPhrase = await passworder.encrypt(password, data)
        await setChromeStorage({ 'koiPhrase': encryptedPhrase })
      } 
      /* istanbul ignore next */
      await removeChromeStorage(STORAGE.SITE_PERMISSION)
      await removeChromeStorage(STORAGE.PENDING_REQUEST)
      await removeChromeStorage(STORAGE.CONTENT_LIST)
      await removeChromeStorage(STORAGE.ACTIVITIES_LIST)
      history.push(redirectPath)
      dispatch(getBalances())
    })
    const importFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(importSuccessHandler)
    backgroundConnect.addHandler(importFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.IMPORT_WALLET,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const loadWallet = (inputData) => (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const loadSuccessHandler = new CreateEventHandler(MESSAGES.LOAD_WALLET_SUCCESS, response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
    })
    const loadFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(loadSuccessHandler)
    backgroundConnect.addHandler(loadFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.LOAD_WALLET,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const removeWallet = (inputData) => (dispatch) => {
  try {
    const { history } = inputData
    dispatch(setIsLoading(true))
    const removeSuccessHandler = new CreateEventHandler(MESSAGES.REMOVE_WALLET_SUCCESS, response => {
      const { koiData } = response.data
      dispatch(setAssets([]))
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      history.push('/account/welcome')
    })
    const removeFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(removeSuccessHandler)
    backgroundConnect.addHandler(removeFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.REMOVE_WALLET
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const lockWallet = (inputData) => (dispatch) => {
  try {
    const { history } = inputData
    dispatch(setIsLoading(true))
    const lockSuccessHandler = new CreateEventHandler(MESSAGES.LOCK_WALLET_SUCCESS, response => {
      dispatch(setKoi({
        koiBalance: null,
        arBalance: null,
        address: null
      }))
      dispatch(setIsLoading(false))
      history.push(PATH.LOGIN)
    })
    const lockFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(lockSuccessHandler)
    backgroundConnect.addHandler(lockFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.LOCK_WALLET
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const unlockWallet = (inputData) => (dispatch) => {
  try {
    const { history } = inputData
    dispatch(setIsLoading(true))
    const unlockSuccessHandler = new CreateEventHandler(MESSAGES.UNLOCK_WALLET_SUCCESS, async response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      const storage = await getChromeStorage(STORAGE.PENDING_REQUEST)
      /* istanbul ignore next */
      switch (get(storage[STORAGE.PENDING_REQUEST], 'type')) {
        case REQUEST.PERMISSION:
          history.push('/account/connect-site')
          break
        case REQUEST.TRANSACTION:
          history.push('/account/sign-transaction')
          break
        default:
          history.push('/account')
      }
    })
    const unlockFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(unlockSuccessHandler)
    backgroundConnect.addHandler(unlockFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.UNLOCK_WALLET,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

/* istanbul ignore next */
export const generateWallet = (inputData) => async (dispatch) => {
  try {
    const { stage, password } = inputData

    dispatch(setIsLoading(true))
    const seedPhrase = await generateWalletUtil(koi)
    const encryptedKey = await passworder.encrypt(password, koi.wallet)
    await setChromeStorage({ 'createdWalletAddress': koi.address, 'createdWalletKey': encryptedKey })
    dispatch(setCreateWallet({ seedPhrase, stage, password }))
    dispatch(setIsLoading(false))


    // const generateSuccessHandler = new CreateEventHandler(MESSAGES.GENERATE_WALLET_SUCCESS, response => {
    //   const { seedPhrase } = response.data
    //   dispatch(setCreateWallet({ seedPhrase, stage, password }))
    //   dispatch(setIsLoading(false))
    // })
    // const generateFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
    //   console.log('=== BACKGROUND ERROR ===')
    //   const errorMessage = response.data
    //   dispatch(setIsLoading(false))
    //   dispatch(setError(errorMessage))
    // })

    // backgroundConnect.addHandler(generateSuccessHandler)
    // backgroundConnect.addHandler(generateFailedHandler)
    // backgroundConnect.postMessage({
    //   type: MESSAGES.GENERATE_WALLET,
    //   data: inputData
    // })
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
      window.close()
      // history.push(PATH.HOME)
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

export const loadActivities = (inputData) => (dispatch) => {
  try { 
    dispatch(setContLoading(true))
    const loadSuccessHandler = new CreateEventHandler(MESSAGES.LOAD_ACTIVITIES_SUCCESS, response => {
      const { activitiesList, nextOwnedCursor: ownedCursor, nextRecipientCursor: recipientCursor } = response.data
      dispatch(setCursor({ ownedCursor, recipientCursor }))
      dispatch(setActivities(activitiesList))
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
      type: MESSAGES.LOAD_ACTIVITIES,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setContLoading(false))
  }
}

export const makeTransfer = (inputData) => (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const { qty } = inputData
    const transferSuccessHandler = new CreateEventHandler(MESSAGES.MAKE_TRANSFER_SUCCESS, async response => {
      const { txId } = response.data
      const storage = await getChromeStorage(STORAGE.PENDING_TRANSACTION)
      const pendingTransactions = storage[STORAGE.PENDING_TRANSACTION] || []
      pendingTransactions.push({
        id: txId,
        activityName: 'Sent KOI',
        expense: qty,
        accountName: 'Account 1',
        date: moment().formar('MMMM DD YYYY')
      })
      await setChromeStorage({ pendingTransactions })
      dispatch(setTransactions([{
        id: txId,
        activityName: 'Sent KOI',
        expense: qty,
        accountName: 'Account 1'
      }]))
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
    backgroundConnect.postMessage({
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
      console.log('=== BACKGROUND ERROR ===')
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
