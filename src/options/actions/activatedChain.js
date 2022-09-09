import { SET_ACTIVATED_CHAIN } from './types'

export const setActivatedChain = (payload) => (dispatch) => {
  dispatch({ type: SET_ACTIVATED_CHAIN, payload: payload })
}
