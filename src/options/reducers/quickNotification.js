import { CLEAR_QUICK_NOTIFICATION,SET_QUICK_NOTIFICATION } from '../actions/types'

const initialState = null

export default function quickNotificationReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_QUICK_NOTIFICATION: {
      return payload
    }
    case CLEAR_QUICK_NOTIFICATION:
      return null
    default:
      return state
  }
}
