/* 
  Update user data.
*/
import helpers from './helpers'
import { TIME_INTERVAL, MESSAGES } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'
import sendMessageToPorts from './helpers/sendMessageToPorts'
import cache from './cache'
import storage from 'services/storage'
import { v4 as uuid } from 'uuid'

const testNotification = async () => {
  const sendPopupPorts = sendMessageToPorts(cache.getPopupPorts())

  const txId = uuid()
  const message = { title: 'Test notification', message: 'test notification blah blah blah', txId, new: true }
  const notifications = await storage.generic.get.pushNotification()
  notifications.unshift(message)

  await storage.generic.set.pushNotification(notifications)

  sendPopupPorts({
    type: MESSAGES.PUSH_NOTIFICATIONS,
    payload: message
  })
}


export default () => {
  let 
    uploadPendingTransactionInterval,
    loadBalancesArweaveInterval,
    loadBalancesEthereumInterval,
    loadActivitiesArweaveInterval,
    loadActivitiesEthereumInterval,
    loadNftStatesInterval

  try {
    uploadPendingTransactionInterval = setInterval(() => {
      helpers.updatePendingTransactions()
    }, TIME_INTERVAL.LOAD_PENDING_TRANSACTIONS_STATE)

    loadBalancesArweaveInterval = setInterval(() => {
      helpers.loadBalances(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_BALANCES_ARWEAVE)

    loadBalancesEthereumInterval = setInterval(() => {
      helpers.loadBalances(TYPE.ETHEREUM)
    }, TIME_INTERVAL.LOAD_BALANCES_ETHEREUM)

    loadActivitiesArweaveInterval = setInterval(() => {
      helpers.loadActivities(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_ARWEAVE_ACTIVITIES)

    loadActivitiesEthereumInterval = setInterval(() => {
      helpers.loadActivities(TYPE.ETHEREUM)
    }, TIME_INTERVAL.LOAD_ETHEREUM_ACTIVITIES)

    loadNftStatesInterval = setInterval(() => {
      helpers.loadNftStates(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_NFT_STATE)
  } catch (err) {
    console.error('Set interval background error', err.message)
  }
}
