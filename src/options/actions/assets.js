import { SET_ASSETS } from './types'

export const setAssets = (payload) => (dispatch) => {
  dispatch({
    type: SET_ASSETS,
    payload
  })
}
