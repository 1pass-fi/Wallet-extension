import { SET_EDITTING_COLLECTION_ID } from '../actions/types'

const initialState = null

export default editingCollectionIdReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_EDITTING_COLLECTION_ID:
      return payload
    default:
      return state
  }
}
