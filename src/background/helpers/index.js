import { backgroundAccount } from 'services/account'

import loadBalances from './loadBalances'
import updatePendingTransactions from './updatePendingTransactions'
import loadActivities from './loadActivities'
import loadNftStates from './loadNftStates'

const checkHasAccounts = (fn) => (...args) => {
  if (backgroundAccount.importedAccount.length > 0) fn(...args)
}

export default {
  loadBalances: checkHasAccounts(loadBalances),
  updatePendingTransactions: checkHasAccounts(updatePendingTransactions),
  loadActivities: checkHasAccounts(loadActivities),
  loadNftStates: checkHasAccounts(loadNftStates)
}
