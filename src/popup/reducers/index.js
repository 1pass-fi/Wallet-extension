import { combineReducers } from 'redux'

import loading from './loading'
import contLoading from './continueLoading'
import error from './error'
import notification from './notification'
import koi from './koi'
import createWallet from './createWallet'
import assets from './assets'
import activities from './activities'
import transactions from './transactions'

export default combineReducers({
  loading,
  contLoading,
  error,
  notification,
  koi,
  createWallet,
  assets,
  activities,
  transactions
})
