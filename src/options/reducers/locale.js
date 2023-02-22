import { SET_CURRENT_LOCALE } from 'options/actions/types'

const initialState = ''

export default (state = initialState, action) => {
  const { type, payload } = action
  switch (type) {
    case SET_CURRENT_LOCALE:
      return payload
    default:
      return state
  }
}
