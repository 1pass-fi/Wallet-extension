/* 
  Update user data.
*/
import { TYPE } from 'constants/accountConstants'
import { MESSAGES,TIME_INTERVAL } from 'constants/koiConstants'
import storage from 'services/storage'
import { v4 as uuid } from 'uuid'

import sendMessageToPorts from './helpers/sendMessageToPorts'
import cache from './cache'
import helpers from './helpers'

const testNotification = async () => {
  const sendPopupPorts = sendMessageToPorts(cache.getPopupPorts())

  const txId = uuid()
  const message = {
    title: 'Test notification',
    message: 'test notification blah blah blah',
    txId,
    new: true
  }
  const notifications = await storage.generic.get.pushNotification()
  notifications.unshift(message)

  await storage.generic.set.pushNotification(notifications)

  sendPopupPorts({
    type: MESSAGES.PUSH_NOTIFICATIONS,
    payload: message
  })
}

export default () => {
  let uploadPendingTransactionInterval,
    loadBalancesArweaveInterval,
    loadBalancesEthereumInterval,
    loadBalancesSolanaInterval,
    loadBalancesK2Interval,
    loadActivitiesArweaveInterval,
    loadActivitiesEthereumInterval,
    loadActivitiesSolanaInterval,
    loadActivitiesK2Interval,
    loadNftStatesInterval,
    keepAlive

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

    loadBalancesSolanaInterval = setInterval(() => {
      helpers.loadBalances(TYPE.SOLANA)
    }, TIME_INTERVAL.LOAD_BALANCES_SOLANA)

    loadBalancesK2Interval = setInterval(() => {
      helpers.loadBalances(TYPE.ETHEREUM)
    }, TIME_INTERVAL.LOAD_BALANCES_K2)

    loadActivitiesArweaveInterval = setInterval(() => {
      helpers.loadActivities(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_ARWEAVE_ACTIVITIES)

    loadActivitiesEthereumInterval = setInterval(() => {
      helpers.loadActivities(TYPE.ETHEREUM)
    }, TIME_INTERVAL.LOAD_ETHEREUM_ACTIVITIES)

    loadActivitiesSolanaInterval = setInterval(() => {
      helpers.loadActivities(TYPE.SOLANA)
    }, TIME_INTERVAL.LOAD_SOLANA_ACTIVITIES)

    loadActivitiesK2Interval = setInterval(() => {
      helpers.loadActivities(TYPE.K2)
    }, TIME_INTERVAL.LOAD_K2_ACTIVITIES)

    loadNftStatesInterval = setInterval(() => {
      helpers.loadNftStates(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_NFT_STATE)

    keepAlive = setInterval(() => {
      chrome.storage.local.get()
    }, TIME_INTERVAL.KEEP_ALIVE)
  } catch (err) {
    console.error('Set interval background error', err.message)
  }
}
