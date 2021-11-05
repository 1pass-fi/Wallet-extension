import { ADD_ACCOUNT_BY_ADDRESS, SET_ACCOUNTS } from 'options/actions/types'

const initialState = []

export default function accountsReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_ACCOUNTS:
      return payload
    case ADD_ACCOUNT_BY_ADDRESS:
      return [...state, payload]
    default:
      return state
  }
}
