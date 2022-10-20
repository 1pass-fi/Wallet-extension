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
import currency from './currency'
import defaultAccount from './defaultAccount'
import error from './error'
import koi from './koi'
import loading from './loading'
import notification from './notification'
import price from './price'
import settings from './settings'
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
  accountName,
  price,
  currency,
  accounts,
  defaultAccount,
  activityNotifications,
  settings,
  assetsSettings,
  activatedChain
})
