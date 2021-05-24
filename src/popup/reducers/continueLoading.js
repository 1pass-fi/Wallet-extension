import { SET_CONT_LOADING } from '../actions/types'

const initialState = false

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_CONT_LOADING:
      return payload
    default:
      return state
  }
}
