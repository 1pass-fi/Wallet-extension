import { SET_ACTIVITIES } from 'actions/types'

const initialState = []

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_ACTIVITIES:
      return payload
    default:
      return state
  }
}