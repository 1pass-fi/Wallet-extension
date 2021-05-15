import { SET_ERROR } from '../actions/types'

const initialState = null

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_ERROR:
      return payload
    default:
      return state
  }
}
