import { SET_CREATE_COLLECTION } from './types'

export const setCreateCollection = (payload) => (dispatch) => {
  dispatch({
    type: SET_CREATE_COLLECTION,
    payload
  })
}
