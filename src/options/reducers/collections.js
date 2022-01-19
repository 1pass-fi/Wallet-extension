import { SET_COLLECTIONS, SET_FILTER_COLLECTIONS } from 'options/actions/types'

const initialState = {
  collectionsLoaded: false,
  collections: [],
  filteredCollections: []
}

export default function collectionsReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_COLLECTIONS:
      return { ...state, ...payload }
    case SET_FILTER_COLLECTIONS:
      return { ...state, filteredCollections: [...payload] }
    default:
      return state
  }
}
