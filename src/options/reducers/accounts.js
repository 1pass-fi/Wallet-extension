import { SET_ACCOUNTS } from 'options/actions/types'

const initialState = []

export default function accountsReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_ACCOUNTS:
      return payload
    default:
      return state
  }
}
