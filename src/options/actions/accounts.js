import { popupAccount } from 'services/account'
import storage from 'services/storage'

import { setDefaultAccountByAddress } from './defaultAccount'
import actionHelpers from './helpers'
import { 
  ADD_ACCOUNT_BY_ADDRESS, 
  SET_ACCOUNTS,
  SET_DEFAULT_ARWEAVE_ACCOUNT 
} from './types'

export const loadAllAccounts = () => async (dispatch) => {
  await popupAccount.loadImported()
  const allAccounts = await popupAccount.getAllMetadata()
  await dispatch(setAccounts(allAccounts))

  return allAccounts
}

export const setAccounts = (accounts) => async (dispatch) => {
  const defaultAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
  dispatch(setDefaultAccountByAddress(defaultAccountAddress))

  const defaultK2AccountAddress = await storage.setting.get.activatedK2AccountAddress()
  dispatch(setDefaultAccountByAddress(defaultK2AccountAddress))

  const defaultEthereumAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
  dispatch(setDefaultAccountByAddress(defaultEthereumAccountAddress))

  const defaultSolanaAccountAddress = await storage.setting.get.activatedSolanaAccountAddress()
  dispatch(setDefaultAccountByAddress(defaultSolanaAccountAddress))

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

export const loadAllFriendReferralData = () => async (dispatch) => {
  await actionHelpers.loadFriendReferralData()
  dispatch(loadAllAccounts())
}
