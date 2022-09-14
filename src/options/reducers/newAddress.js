import { SET_NEW_ADDRESS } from 'options/actions/types'

const initialState = null

export default function newAddressReducer(state = initialState, action) {
  const { type, payload } = action

  switch (type) {
    case SET_NEW_ADDRESS:
      return payload
    default:
      return state
  }
}
