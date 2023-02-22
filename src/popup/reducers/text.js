import { SET_TEXT } from '../actions/types'

const initialState = {}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_TEXT:
      return payload
    default:
      return state
  }
}
