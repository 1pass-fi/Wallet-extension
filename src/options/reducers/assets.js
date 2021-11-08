import { SET_ASSETS } from '../actions/types'

const initialState = {
  nfts: []
}

export default function assetsReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_ASSETS:
      return { ...state, ...payload }
    default:
      return state
  }
}
