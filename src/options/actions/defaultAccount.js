import {
  SET_DEFAULT_ACCOUNT,
  UPDATE_DEFAULT_ACCOUNT,
  SET_DEFAULT_ETHEREUM_ACCOUNT,
  UPDATE_DEFAULT_ETHEREUM_ACCOUNT
} from './types'

import isEmpty from 'lodash/isEmpty'

import { TYPE } from 'constants/accountConstants'
import { popupAccount } from 'services/account'

import { setActivatedAccountAddress } from 'utils'

export const setDefaultAccountByAddress = (address) => async (dispatch) => {
  if (isEmpty(address)) {
    return
  }

  await setActivatedAccountAddress(address)

  const account = await popupAccount.getAccount({
    address: address
  })
  const defaultAccount = await account.get.metadata()

  if (defaultAccount.type === TYPE.ARWEAVE) {
    return dispatch({
      type: SET_DEFAULT_ACCOUNT,
      payload: defaultAccount
    })
  }

  if (defaultAccount.type === TYPE.ETHEREUM) {
    return dispatch({
      type: SET_DEFAULT_ETHEREUM_ACCOUNT,
      payload: defaultAccount
    })
  }
}

export const setDefaultAccount = (account) => async (dispatch) => {
  if (!isEmpty(account?.address)) {
    await setActivatedAccountAddress(account.address, account.type)
  }

  if (account.type === TYPE.ARWEAVE) {
    return dispatch({
      type: SET_DEFAULT_ACCOUNT,
      payload: account
    })
  }

  if (account.type === TYPE.ETHEREUM) {
    return dispatch({
      type: SET_DEFAULT_ETHEREUM_ACCOUNT,
      payload: account
    })
  }
}

export const updateDefaultAccount = (newAccountInfo) => async (dispatch) => {
  if (!isEmpty(newAccountInfo?.address)) {
    await setActivatedAccountAddress(newAccountInfo.address, newAccountInfo.type)
  }

  if (newAccountInfo.type === TYPE.ARWEAVE) {
    return dispatch({
      type: UPDATE_DEFAULT_ACCOUNT,
      payload: newAccountInfo
    })
  }

  if (newAccountInfo.type === TYPE.ETHEREUM) {
    return dispatch({
      type: UPDATE_DEFAULT_ETHEREUM_ACCOUNT,
      payload: newAccountInfo
    })
  }
}
