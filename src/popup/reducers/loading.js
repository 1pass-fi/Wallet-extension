import { SET_LOADING } from '../actions/types'

const initialState = 0

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_LOADING:
      if (payload) {
        return state + 1
      } else {
        return state - 1
      }
    default:
      return state
  }
}
