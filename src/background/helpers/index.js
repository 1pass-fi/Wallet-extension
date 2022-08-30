import cache from 'background/cache'
import { MESSAGES } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'

import cloneTransaction from './cloneTransaction'
import collections from './collections'
import did from './did'
import loadActivities from './loadActivities'
import loadBalances from './loadBalances'
import loadNftStates from './loadNftStates'
import pendingTransactionFactory from './pendingTransaction'
import saveContent from './saveContent'
import sendMessageToPorts from './sendMessageToPorts'
import updatePendingTransactions from './updatePendingTransactions'
import uploadNft from './uploadNft'

const checkHasAccounts = (fn) => (...args) => {
  if (backgroundAccount.importedAccount.length > 0) return fn(...args)
}

const sendMessageAfterRun = (fn, message) => async (...args) => {
  await fn(...args)
  sendMessageToPorts(cache.getPopupPorts())(message)
}

const helpers = {
  loadBalances: sendMessageAfterRun(checkHasAccounts(loadBalances), {
    type: MESSAGES.GET_BALANCES_SUCCESS
  }),
  updatePendingTransactions: checkHasAccounts(updatePendingTransactions),
  loadActivities: checkHasAccounts(loadActivities),
  loadNftStates: checkHasAccounts(loadNftStates),
  sendMessageToPopupPorts: () => {},
  pendingTransactionFactory,
  uploadNft,
  saveContent,
  cloneTransaction,
  did,
  collections
}

// popupPorts will be undefined as first synchronous run
setTimeout(() => {
  helpers.sendMessageToPopupPorts = sendMessageToPorts(cache.getPopupPorts())
}, 0)

export default helpers
