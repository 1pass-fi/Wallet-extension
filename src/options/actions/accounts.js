import { SET_ACCOUNTS } from './types'

export const setAccounts = (accounts) => (dispatch) => {
  return dispatch({
    type: SET_ACCOUNTS,
    payload: accounts,
  })
}
