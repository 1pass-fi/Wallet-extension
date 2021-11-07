import { combineReducers } from 'redux'

import accounts from './accounts'
import defaultAccount from './defaultAccount'
import createCollection from './createCollection'
import collections from './collections'
import assets from './assets'

export default combineReducers({ 
  accounts, 
  defaultAccount, 
  createCollection, 
  collections,
  assets
})
