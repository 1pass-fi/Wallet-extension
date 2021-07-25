import { SET_ACCOUNTS } from 'actions/types'

const initialState = []

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_ACCOUNTS:
      return payload
    default:
      return state
  }
}
