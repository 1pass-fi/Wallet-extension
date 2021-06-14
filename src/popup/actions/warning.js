import { SET_WARNING } from './types'
import { clearMessage } from './clearMessage' 

export const setWarning = (payload) => async (dispatch) => {
  await clearMessage(dispatch)
  dispatch({ type: SET_WARNING, payload })
}
