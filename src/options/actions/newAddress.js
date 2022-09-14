import { SET_NEW_ADDRESS } from './types'

export const setNewAddress = (payload) => (dispatch) => {
  dispatch({ type: SET_NEW_ADDRESS, payload })
}
