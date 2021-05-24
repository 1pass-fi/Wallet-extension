import { combineReducers } from 'redux'

import loading from './loading'
import contLoading from './continueLoading'
import error from './error'
import koi from './koi'
import createWallet from './createWallet'
import assets from './assets'
import activities from './activities'
import transactions from './transactions'

export default combineReducers({
  loading,
  contLoading,
  error,
  koi,
  createWallet,
  assets,
  activities,
  transactions
})
