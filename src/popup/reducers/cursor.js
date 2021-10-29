import { SET_CURSOR } from 'actions/types'

const initialState = { offset: 0, limit: 20, doneLoading: false }

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_CURSOR:
      return { ...state, ...payload }
    default:
      return state
  }
}
