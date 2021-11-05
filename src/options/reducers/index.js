import { combineReducers } from 'redux'

import accounts from './accounts'
import defaultAccount from './defaultAccount'

export default combineReducers({ accounts, defaultAccount })
