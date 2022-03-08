import { combineReducers } from 'redux'

import accounts from './accounts'
import addressBook from './addressBook'
import defaultAccount from './defaultAccount'
import createCollection from './createCollection'
import collections from './collections'
import assets from './assets'
import notificationsData from './notifications'

export default combineReducers({
  accounts,
  addressBook,
  defaultAccount,
  createCollection,
  collections,
  assets,
  notificationsData
})
