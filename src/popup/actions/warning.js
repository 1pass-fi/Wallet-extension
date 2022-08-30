import { clearMessage } from './clearMessage' 
import { SET_WARNING } from './types'

export const setWarning = (payload) => async (dispatch) => {
  await clearMessage(dispatch)
  dispatch({ type: SET_WARNING, payload })
}
