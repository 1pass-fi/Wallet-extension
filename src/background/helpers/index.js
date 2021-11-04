import { backgroundAccount } from 'services/account'
import { popupPorts } from '../index'

import loadBalances from './loadBalances'
import updatePendingTransactions from './updatePendingTransactions'
import loadActivities from './loadActivities'
import loadNftStates from './loadNftStates'
import sendMessageToPorts from './sendMessageToPorts'

const checkHasAccounts = (fn) => (...args) => {
  if (backgroundAccount.importedAccount.length > 0) fn(...args)
}

const helpers = {
  loadBalances: checkHasAccounts(loadBalances),
  updatePendingTransactions: checkHasAccounts(updatePendingTransactions),
  loadActivities: checkHasAccounts(loadActivities),
  loadNftStates: checkHasAccounts(loadNftStates),
  sendMessageToPopupPorts: () => {}
}
 
setTimeout(() => {
  helpers.sendMessageToPopupPorts = sendMessageToPorts(popupPorts)
}, 0)

export default helpers
