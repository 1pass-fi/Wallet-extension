import {
  UPDATE_DEFAULT_ACCOUNT,
  SET_DEFAULT_ACCOUNT,
  SET_DEFAULT_ACCOUNT_BY_ADDRESS
} from './types'

import isEmpty from 'lodash/isEmpty'

import { popupAccount } from 'services/account'
import storage from 'services/storage'

export const setDefaultAccountByAddress = (address) => async (dispatch) => {
  if (!isEmpty(address)) {
    await storage.setting.set.activatedAccountAddress(address)
  }

  const account = await popupAccount.getAccount({
    address: address
  })
  const defaultAccount = await account.get.metadata()

  return dispatch({
    type: SET_DEFAULT_ACCOUNT_BY_ADDRESS,
    payload: defaultAccount
  })
}

export const setDefaultAccount = (account) => async (dispatch) => {
  if (!isEmpty(account?.address)) {
    await storage.setting.set.activatedAccountAddress(account.address)
  }

  return dispatch({
    type: SET_DEFAULT_ACCOUNT,
    payload: account
  })
}

export const updateDefaultAccount = (newAccountInfo) => async (dispatch) => {
  if (!isEmpty(newAccountInfo?.address)) {
    await storage.setting.set.activatedAccountAddress(newAccountInfo.address)
  }
  return dispatch({
    type: UPDATE_DEFAULT_ACCOUNT,
    payload: newAccountInfo
  })
}
