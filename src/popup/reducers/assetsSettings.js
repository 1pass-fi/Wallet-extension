import { SET_ASSETS_TAB_SETTINGS } from 'actions/types'

const initialState = {
  showAllAccounts: true,
  selectAccountsCollapsed: false,
  accountsToShow: [],
}

export default (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_ASSETS_TAB_SETTINGS:
      return { ...state, ...payload }
    default:
      return state
  }
}
