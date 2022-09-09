import { TYPE } from 'constants/accountConstants'

import { SET_ACTIVATED_CHAIN } from '../actions/types'

const initialState = TYPE.K2

export default function activatedChainReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_ACTIVATED_CHAIN: {
      return payload
    }
    default:
      return state
  }
}
