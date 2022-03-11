import { SET_ACTIVATED_CHAIN } from './types'

export const setActivatedChain = (payload) => async (dispatch) => {
  return dispatch({
    type: SET_ACTIVATED_CHAIN,
    payload: payload
  })
}
