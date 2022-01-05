import { SET_NOTIFICATIONS, ADD_NOTIFICATION, VIEW_NOTIFICATIONS } from '../actions/types'

const initialState = {
  new: 0,
  notifications: []
}

export default function notificationsDataReducer(state = initialState, action) {
  const { type, payload } = action
  switch (type) {
    case SET_NOTIFICATIONS:
      return { new: 0, notifications: payload }
    case ADD_NOTIFICATION:
      return { new: state.new + 1, notifications: [...state.notifications, payload] }
    case VIEW_NOTIFICATIONS:
      return { ...state, new: 0 }
    default:
      return state
  }
}
