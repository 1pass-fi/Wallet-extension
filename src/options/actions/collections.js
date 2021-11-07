import { SET_COLLECTIONS } from './types'

export const setCollections = (payload) => (dispatch) => {
  dispatch({
    type: SET_COLLECTIONS,
    payload
  })
}
