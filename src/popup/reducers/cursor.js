import { SET_CURSOR } from 'actions/types'

const initialState = { ownedCursor: null, recipientCursor: null, doneLoading: false }

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_CURSOR:
      return { ...state, ...payload }
    default:
      return state
  }
}
