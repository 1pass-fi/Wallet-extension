import { backgroundAccount } from 'services/account'

import { MESSAGES } from 'constants/koiConstants'

import loadBalances from './loadBalances'
import updatePendingTransactions from './updatePendingTransactions'
import loadActivities from './loadActivities'
import loadNftStates from './loadNftStates'
import sendMessageToPorts from './sendMessageToPorts'
import pendingTransactionFactory from './pendingTransaction'
import uploadNft from './uploadNft'
import saveContent from './saveContent'

import cache from 'background/cache'

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
  saveContent
}

// popupPorts will be undefined as first synchronous run
setTimeout(() => {
  helpers.sendMessageToPopupPorts = sendMessageToPorts(cache.getPopupPorts())
}, 0)

export default helpers
