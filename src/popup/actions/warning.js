import { SET_WARNING } from './types'

// export const setWarning = (payload) => ({ type: SET_WARNING, payload })
export const setWarning = (payload) => (dispatch) => {
  dispatch({ type: SET_WARNING, payload: null })
  setTimeout(() => {
    dispatch({ type: SET_WARNING, payload })
  }, 200)
}
