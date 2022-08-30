import { clearMessage } from './clearMessage' 
import { SET_ERROR } from './types'

export const setError = (payload) => async (dispatch) => {
  await clearMessage(dispatch)
  dispatch({ type: SET_ERROR, payload })
}
