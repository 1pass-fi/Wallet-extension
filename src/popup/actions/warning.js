import { SET_WARNING } from './types'
import { clearMessage } from './clearMessage' 

export const setWarning = (payload) => (dispatch) => {
  clearMessage(dispatch)
  setTimeout(() => {
    dispatch({ type: SET_WARNING, payload })
  }, 200)
}
