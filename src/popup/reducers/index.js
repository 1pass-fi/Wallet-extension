import { combineReducers } from 'redux'

import loading from './loading'
import error from './error'
import koi from './koi'

export default combineReducers({
  loading,
  error,
  koi
})
