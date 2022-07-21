import {
  SET_DEFAULT_ARWEAVE_ACCOUNT,
  SET_DEFAULT_ETHEREUM_ACCOUNT,
  SET_DEFAULT_SOLANA_ACCOUNT
} from './types'

import isEmpty from 'lodash/isEmpty'

import { TYPE } from 'constants/accountConstants'
import { popupAccount } from 'services/account'

import { setActivatedAccountAddress } from 'utils'

export const setDefaultAccountByAddress = (address) => async (dispatch) => {
  if (isEmpty(address)) {
    return
  }

  const account = await popupAccount.getAccount({
    address: address
  })
  const defaultAccount = await account.get.metadata()

  await setActivatedAccountAddress(defaultAccount.address, defaultAccount.type)

  if (defaultAccount.type === TYPE.ARWEAVE) {
    return dispatch({
      type: SET_DEFAULT_ARWEAVE_ACCOUNT,
      payload: defaultAccount
    })
  }

  if (defaultAccount.type === TYPE.ETHEREUM) {
    return dispatch({
      type: SET_DEFAULT_ETHEREUM_ACCOUNT,
      payload: defaultAccount
    })
  }

  if (defaultAccount.type === TYPE.SOLANA) {
    return dispatch({
      type: SET_DEFAULT_SOLANA_ACCOUNT,
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
      type: SET_DEFAULT_ARWEAVE_ACCOUNT,
      payload: account
    })
  }

  if (account.type === TYPE.ETHEREUM) {
    return dispatch({
      type: SET_DEFAULT_ETHEREUM_ACCOUNT,
      payload: account
    })
  }

  if (account.type === TYPE.SOLANA) {
    return dispatch({
      type: SET_DEFAULT_SOLANA_ACCOUNT,
      payload: account
    })
  }
}
