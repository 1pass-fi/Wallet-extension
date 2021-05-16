import { combineReducers } from 'redux'

import loading from './loading'
import error from './error'
import koi from './koi'
import createWallet from './createWallet'

export default combineReducers({
  loading,
  error,
  koi,
  createWallet
})
