import { CLEAR_NOTIFICATION,SET_NOTIFICATION } from '../actions/types'

const initialState = null

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_NOTIFICATION:
      return payload
    case CLEAR_NOTIFICATION:
      return null
    default:
      return state
  }
}
