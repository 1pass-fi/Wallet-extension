import { CLEAR_ERROR,SET_ERROR } from './types'

export const setError = (error) => (dispatch) => {
  dispatch({
    type: CLEAR_ERROR
  })

  dispatch({
    type: SET_ERROR,
    payload: error
  })
}

export const clearError = (dispatch) => {
  dispatch({
    type: CLEAR_ERROR
  })
}
