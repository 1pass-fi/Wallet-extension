import { SET_CREATE_COLLECTION } from 'options/actions/types'

const initialState = {
  selectedNfts: [],
  currentPage: 0,
  totalPage: 1,
  stage: 1
}

export default function createCollectionReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_CREATE_COLLECTION:
      return { ...state, ...payload }
    default:
      return state
  }
}
