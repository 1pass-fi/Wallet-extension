import { SET_IS_LOADING, SET_LOADED } from 'options/actions/types'
  
const initialState = 0
  
export default function isLoadingReducer(state = initialState, action) {
  const { type } = action
  
  switch (type) {
    case SET_IS_LOADING:
      return state + 1
    case SET_LOADED:
      return !state || (state - 1)
    default:
      return state
  }
}
