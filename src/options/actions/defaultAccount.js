import { SET_DEFAULT_ACCOUNT, SET_DEFAULT_ACCOUNT_BY_ADDRESS } from './types'

import { popupAccount } from 'services/account'

export const setDefaultAccountByAddress = (address) => async (dispatch) => {
  const account = await popupAccount.getAccount({
    address: address,
  })
  const defaultAccount = await account.get.metadata()

  return dispatch({
    type: SET_DEFAULT_ACCOUNT_BY_ADDRESS,
    payload: defaultAccount,
  })
}

export const setDefaultAccount = (account) => async (dispatch) => {
  return dispatch({
    type: SET_DEFAULT_ACCOUNT,
    payload: account,
  })
}
