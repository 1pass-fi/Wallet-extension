import { SET_PRICE } from 'actions/types'

const initialState = {
  AR: 1,
  KOI: 1,
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_PRICE:
      return { ...state, ...payload }
    default:
      return state
  }
}
