import { SET_ETHEREUM } from 'actions/types'

const initialState = {
  ethBalance: null,
  ethAddress: null
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_ETHEREUM:
      return { ...state, ...payload }
    default:
      return state
  }
}
