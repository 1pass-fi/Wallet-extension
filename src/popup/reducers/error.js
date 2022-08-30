import { CLEAR_ERROR,SET_ERROR } from '../actions/types'

const initialState = null

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_ERROR:
      return payload
    case CLEAR_ERROR:
      return null
    default:
      return state
  }
}
