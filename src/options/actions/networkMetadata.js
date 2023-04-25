import { SET_NETWORK_METADATA } from './types'

export const setNetworkMetadata = (payload) => async (dispatch) => {
  dispatch({ type: SET_NETWORK_METADATA, payload })
}
