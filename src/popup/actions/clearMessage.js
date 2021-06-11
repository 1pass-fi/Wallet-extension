import { CLEAR_ERROR, CLEAR_NOTIFICATION, CLEAR_WARNING } from './types'

export const clearMessage = async (dispatch) => {
  dispatch({ type: CLEAR_ERROR })
  dispatch({ type: CLEAR_NOTIFICATION })
  dispatch({ type: CLEAR_WARNING })
}
