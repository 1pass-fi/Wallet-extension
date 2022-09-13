import { SET_WALLET_LOADED } from 'options/actions/types'

const initialState = false

export default function walletLoadedReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_WALLET_LOADED:
      return payload
    default:
      return state
  }
}
