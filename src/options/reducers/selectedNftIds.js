import { SET_SELECTED_NFT_IDS } from 'options/actions/types'

const initialState = []

export default function nftIdReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_SELECTED_NFT_IDS:
      return payload
    default:
      return state
  }
}
