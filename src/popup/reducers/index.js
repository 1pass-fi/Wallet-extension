import { combineReducers } from 'redux'

import loading from './loading'
import error from './error'
import koi from './koi'
import createWallet from './createWallet'
import assets from './assets'

export default combineReducers({
  loading,
  error,
  koi,
  createWallet,
  assets
})
