import { combineReducers } from 'redux'

import accounts from './accounts'
import activatedChain from './activatedChain'
import addressBook from './addressBook'
import assets from './assets'
import collections from './collections'
import defaultAccount from './defaultAccount'
import editingCollectionId from './editingCollectionId'
import error from './error'
import isLoading from './loading'
import isOnbardingProcessing from './loading'
import locale from './locale'
import newAddress from './newAddress'
import notificationsData from './notifications'
import onboarding from './onboarding'
import quickNotification from './quickNotification'
import selectedNftIds from './selectedNftIds'
import walletLoaded from './walletLoaded'

export default combineReducers({
  accounts,
  addressBook,
  defaultAccount,
  collections,
  assets,
  notificationsData,
  isLoading,
  isOnbardingProcessing,
  onboarding,
  error,
  quickNotification,
  activatedChain,
  selectedNftIds,
  editingCollectionId,
  newAddress,
  walletLoaded,
  locale
})
