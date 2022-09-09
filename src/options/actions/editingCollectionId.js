import { SET_EDITTING_COLLECTION_ID } from '../actions/types'

export const setEditingCollectionId = (editingCollectionId) => (dispatch) => {
  dispatch({ type: SET_EDITTING_COLLECTION_ID, payload: editingCollectionId })
}
