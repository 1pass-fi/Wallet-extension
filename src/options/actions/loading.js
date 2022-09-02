import { SET_IS_LOADING, SET_LOADED } from './types'

export const setIsLoading = (dispatch) => {
  dispatch({ type: SET_IS_LOADING })
}

export const setLoaded = (dispatch) => {
  dispatch({ type: SET_LOADED })
}
