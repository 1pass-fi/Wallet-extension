import { TYPE } from 'constants/accountConstants'

import { SET_ACTIVATED_CHAIN } from '../actions/types'

const initialState = TYPE.K2

export default function activatedChainReducer(state = initialState, action) {
  const { type, payload } = action

  const networkType = [TYPE.K2, TYPE.ARWEAVE, TYPE.SOLANA, TYPE.ETHEREUM]

  switch (type) {
    case SET_ACTIVATED_CHAIN: {
      if (!networkType.includes(payload)) return initialState

      return payload
    }
    default:
      return state
  }
}
