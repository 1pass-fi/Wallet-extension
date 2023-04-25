import { SET_CURRENT_PROVIDER } from 'actions/types'

const initialState = null

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CURRENT_PROVIDER:
      return payload 
    default:
      return state
  }
}
