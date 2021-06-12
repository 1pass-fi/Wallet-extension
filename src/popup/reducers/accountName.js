import { SET_ACCOUNT_NAME } from 'actions/types'

const initialState = null

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_ACCOUNT_NAME:
      return payload 
    default:
      return state
  }
}
