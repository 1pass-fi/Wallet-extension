import { SET_SETTINGS } from 'actions/types'

const initialState = {
  showAllAccounts: true,
  accountsToShowOnActivities: []
}

export default (state = initialState, action) => {
  const { type, payload } = action
  switch(type) {
    case SET_SETTINGS:
      return { ...state, ...payload }
    default:
      return state
  }
}
