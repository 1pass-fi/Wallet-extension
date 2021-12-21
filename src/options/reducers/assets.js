import { SET_ASSETS, SET_FILTER_NFTS } from '../actions/types'

const initialState = {
  nfts: [],
  filteredNfts: []
}

export default function assetsReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_ASSETS:
      return { ...state, ...payload }
    case SET_FILTER_NFTS:
      return { ...state, filteredNfts: [...payload] }
    default:
      return state
  }
}
