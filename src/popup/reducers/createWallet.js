import { SET_CREATE_WALLET } from '../actions/types'

const initialState = {
  stage: 1,
  password: null,
  seedPhrase: null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_CREATE_WALLET:
      return { ...state, ...payload }
    default:
      return state
  }
}
