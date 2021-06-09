import { SET_WARNING } from '../actions/types'

const initialState = null

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_WARNING:
      return payload
    default:
      return state
  }
}
