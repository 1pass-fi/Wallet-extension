import { setIsLoading } from './loading'
import { setError } from './error'
import { setCreateWallet } from './createWallet'
import { setAssets } from './assets'
import backgroundConnect, { CreateEventHandler } from './backgroundConnect'

import { MESSAGES, PATH } from 'constants'

import { SET_KOI } from 'actions/types'

export const importWallet = (inputData) => (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const { history, redirectPath } = inputData
    const importSuccessHandler = new CreateEventHandler(MESSAGES.IMPORT_WALLET_SUCCESS, response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      history.push(redirectPath)
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

export const removeWallet = () => (dispatch) => {
  try {
    dispatch(setIsLoading(true))
    const removeSuccessHandler = new CreateEventHandler(MESSAGES.REMOVE_WALLET_SUCCESS, response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
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
    const unlockSuccessHandler = new CreateEventHandler(MESSAGES.UNLOCK_WALLET_SUCCESS, response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      history.push('/account')
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

export const generateWallet = (inputData) => (dispatch) => {
  try {
    const { stage, password } = inputData

    dispatch(setIsLoading(true))
    const generateSuccessHandler = new CreateEventHandler(MESSAGES.GENERATE_WALLET_SUCCESS, response => {
      const { seedPhrase } = response.data
      dispatch(setCreateWallet({ seedPhrase, stage, password }))
      dispatch(setIsLoading(false))
    })
    const generateFailedHandler = new CreateEventHandler(MESSAGES.ERROR, response => {
      console.log('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(generateSuccessHandler)
    backgroundConnect.addHandler(generateFailedHandler)
    backgroundConnect.postMessage({
      type: MESSAGES.GENERATE_WALLET,
      data: inputData
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const saveWallet = (inputData) => (dispatch) => {
  try {
    const { history } = inputData
    dispatch(setIsLoading(true))
    const saveSuccessHandler = new CreateEventHandler(MESSAGES.SAVE_WALLET_SUCCESS, response => {
      const { koiData } = response.data
      dispatch(setKoi(koiData))
      dispatch(setIsLoading(false))
      history.push(PATH.HOME)
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
    dispatch(setIsLoading(true))
    const saveSuccessHandler = new CreateEventHandler(MESSAGES.LOAD_CONTENT_SUCCESS, response => {
      const { contentList } = response.data
      dispatch(setAssets(contentList))
      dispatch(setIsLoading(false))
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
      type: MESSAGES.LOAD_CONTENT,
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const setKoi = (payload) => ({ type: SET_KOI, payload })
