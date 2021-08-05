import { SET_ACTIVITY_NOTIFICATIONS } from 'actions/types'

const initialState = []

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_ACTIVITY_NOTIFICATIONS:
      return payload
    default:
      return state
  }
}
