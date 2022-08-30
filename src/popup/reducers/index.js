import { combineReducers } from 'redux'

import accountName from './accountName'
import accounts from './accounts'
import activatedChain from './activatedChain'
import activities from './activities'
import activityNotifications from './activityNotifications'
import assets from './assets'
import assetsSettings from './assetsSettings'
import contLoading from './continueLoading'
import createWallet from './createWallet'
import creatingWallet from './creatingWallet'
import currency from './currency'
import cursor from './cursor'
import defaultAccount from './defaultAccount'
import error from './error'
import ethereum from './ethereum'
import koi from './koi'
import loading from './loading'
import notification from './notification'
import price from './price'
import settings from './settings'
import transactions from './transactions'
import warning from './warning'

export default combineReducers({
  loading,
  contLoading,
  error,
  notification,
  warning,
  koi,
  createWallet,
  assets,
  activities,
  transactions,
  cursor,
  accountName,
  price,
  creatingWallet,
  currency,
  ethereum,
  accounts,
  defaultAccount,
  activityNotifications,
  settings,
  assetsSettings,
  activatedChain
})
