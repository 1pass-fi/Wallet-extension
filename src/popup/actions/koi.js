import { setIsLoading } from './loading'
import { setError } from './error'
import backgroundConnect, { CreateEventHandler } from './backgroundConnect'

import { MESSAGES } from 'constants'

import { SET_KOI } from 'actions/types'

export const importWallet = (inputData) => async (dispatch) => {
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
      console.error('=== BACKGROUND ERROR ===')
      const errorMessage = response.data
      dispatch(setIsLoading(false))
      dispatch(setError(errorMessage))
    })

    backgroundConnect.addHandler(importSuccessHandler)
    backgroundConnect.addHandler(importFailedHandler)

    backgroundConnect.postMessage({
      type: MESSAGES.IMPORT_WALLET,
      data: { inputData } 
    })
  } catch (err) {
    dispatch(setError(err.message))
    dispatch(setIsLoading(false))
  }
}

export const setKoi = (payload) => ({ type: SET_KOI, payload })
