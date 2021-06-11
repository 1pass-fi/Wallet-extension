import { SET_ERROR } from './types'
import { clearMessage } from './clearMessage' 

export const setError = (payload) => async (dispatch) => {
  await clearMessage(dispatch)
  dispatch({ type: SET_ERROR, payload })
}
