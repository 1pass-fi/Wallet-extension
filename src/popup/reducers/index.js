import { combineReducers } from 'redux'

import loading from './loading'
import contLoading from './continueLoading'
import error from './error'
import notification from './notification'
import warning from './warning'
import koi from './koi'
import createWallet from './createWallet'
import assets from './assets'
import activities from './activities'
import transactions from './transactions'
import cursor from './cursor'
import accountName from './accountName'
import price from './price'
import creatingWallet from './creatingWallet'
import currency from './currency'
import ethereum from './ethereum'
import accounts from './accounts'
import activityNotifications from './activityNotifications'
import settings from './settings'

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
  activityNotifications,
  settings
})
