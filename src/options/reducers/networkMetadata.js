import { SET_NETWORK_METADATA } from '../actions/types'

const initialState = {
  networkName: '---',
  rpcUrl: null,
  chainId: null,
  currencySymbol: '---',
  blockExplorerUrl: null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_NETWORK_METADATA:
      return payload
    default:
      return state
  }
}
