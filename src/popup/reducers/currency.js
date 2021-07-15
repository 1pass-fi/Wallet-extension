import { SET_CURRENCY } from 'actions/types'

const initialState = 'USD'

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CURRENCY:
      return payload 
    default:
      return state
  }
}
