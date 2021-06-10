import { SET_ERROR } from './types'

// export const setError = (payload) => ({ type: SET_ERROR, payload })

// manual dispatch

export const setError = (payload) => (dispatch) => {
  dispatch({ type: SET_ERROR, payload: null })
  setTimeout(() => {
    dispatch({ type: SET_ERROR, payload })
  }, 200)
}
