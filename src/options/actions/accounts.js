import { ADD_ACCOUNT_BY_ADDRESS, SET_ACCOUNTS } from './types'

import { popupAccount } from 'services/account'

export const setAccounts = (accounts) => (dispatch) => {
  return dispatch({
    type: SET_ACCOUNTS,
    payload: accounts,
  })
}

export const addAccountByAddress = (address) => async (dispatch) => {
  const account = await popupAccount.getAccount({
    address,
  })
  const accountMetaData = await account.get.metadata()

  return dispatch({
    type: ADD_ACCOUNT_BY_ADDRESS,
    payload: accountMetaData,
  })
}
