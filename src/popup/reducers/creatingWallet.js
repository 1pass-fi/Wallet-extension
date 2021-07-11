import { SET_CREATING_WALLET } from '../actions/types'

const initialState = false

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CREATING_WALLET:
      return payload
    default:
      return state
  }
}
