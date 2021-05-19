import { SET_KOI } from 'actions/types'

const initialState = {
  arBalance: null,
  koiBalance: null,
  address: null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_KOI:
      return { ...state, ...payload }
    default:
      return state
  }
}
