import { combineReducers } from 'redux'

import accounts from './accounts'
import activatedChain from './activatedChain'
import addressBook from './addressBook'
import assets from './assets'
import collections from './collections'
import createCollection from './createCollection'
import defaultAccount from './defaultAccount'
import error from './error'
import isLoading from './loading'
import notificationsData from './notifications'
import onboarding from './onboarding'
import quickNotification from './quickNotification'
import selectedNftIds from './selectedNftIds'

export default combineReducers({
  accounts,
  addressBook,
  defaultAccount,
  createCollection,
  collections,
  assets,
  notificationsData,
  isLoading,
  onboarding,
  error,
  quickNotification,
  activatedChain,
  selectedNftIds
})
