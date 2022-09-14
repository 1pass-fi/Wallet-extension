import { SET_WALLET_LOADED } from './types'

export const setWalletLoaded = (payload) => (dispatch) => {
  dispatch({ type: SET_WALLET_LOADED, payload })
}
