import { SET_NOTIFICATION } from './types'
import { clearMessage } from './clearMessage' 

export const setNotification = (payload) => (dispatch) => {
  clearMessage(dispatch)
  setTimeout(() => {
    dispatch({ type: SET_NOTIFICATION, payload })
  }, 200)
}
