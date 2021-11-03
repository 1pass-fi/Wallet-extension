/* 
  Update user data.
*/
import helpers from './helpers'
import { TIME_INTERVAL } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'


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
      helpers.loadActivities(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_ARWEAVE_ACTIVITIES)

    loadNftStatesInterval = setInterval(() => {
      helpers.loadNftStates(TYPE.ARWEAVE)
    }, TIME_INTERVAL.LOAD_NFT_STATE)
  } catch (err) {
    console.error('Set interval background error', err.message)
  }
}
