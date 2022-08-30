import { clearMessage } from './clearMessage' 
import { SET_NOTIFICATION } from './types'

export const setNotification = (payload) => async (dispatch) => {
  await clearMessage(dispatch)
  dispatch({ type: SET_NOTIFICATION, payload })
}
