import { SET_NOTIFICATIONS, ADD_NOTIFICATION, VIEW_NOTIFICATIONS } from '../actions/types'

const initialState = {
  new: 0,
  notifications: []
}

export default function notificationsDataReducer(state = initialState, action) {
  const { type, payload } = action
  let _new = 0
  switch (type) {
    case SET_NOTIFICATIONS: {
      _new = payload.filter(n => n.new).length
      return { new: _new, notifications: payload }
    }
    case ADD_NOTIFICATION:
      return { new: state.new + 1, notifications: [payload, ...state.notifications] }
    case VIEW_NOTIFICATIONS:
      return { ...state, new: 0 }
    default:
      return state
  }
}
