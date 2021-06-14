import { SET_NOTIFICATION } from './types'
import { clearMessage } from './clearMessage' 

export const setNotification = (payload) => async (dispatch) => {
  await clearMessage(dispatch)
  dispatch({ type: SET_NOTIFICATION, payload })
}
