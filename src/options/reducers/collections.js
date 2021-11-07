import { SET_COLLECTIONS } from 'options/actions/types'

const initialState = {
  collectionsLoaded: false,
  collections: [],
}

export default function createCollectionReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_COLLECTIONS:
      return { ...state, ...payload }
    default:
      return state
  }
}
