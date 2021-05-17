import { SET_ASSETS } from '../actions/types'

const initialState = []

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_ASSETS:
      return payload
    default:
      return state
  }
}
