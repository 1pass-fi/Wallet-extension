import { combineReducers } from 'redux'

import accounts from './accounts'
import defaultAccount from './defaultAccount'
import createCollection from './createCollection'

export default combineReducers({ accounts, defaultAccount, createCollection })
