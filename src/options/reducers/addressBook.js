import { HIDE_ADDRESS_BOOK, SHOW_ADDRESS_BOOK } from '../actions/types'

const initialState = {
  showing: false
}

export default function addressBookReducers(state = initialState, action) {
  const { type } = action

  switch (type) {
    case SHOW_ADDRESS_BOOK:
      return { ...state, showing: true }

    case HIDE_ADDRESS_BOOK:
      return { ...state, showing: false }
    default:
      return state
  }
}
