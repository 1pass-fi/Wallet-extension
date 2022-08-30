import axios from 'axios'
import cache from 'background/cache'
// Constants
import {
  ETH_NETWORK_PROVIDER,
  MAX_RETRIED,
  MESSAGES,
  PATH,
  PENDING_TRANSACTION_TYPE,
  URL} from 'constants/koiConstants'
import { get,includes } from 'lodash'
import helpers from 'options/actions/helpers'
// Services
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
// Utils
import showNotification from 'utils/notifications'

import did from './did'
import sendMessageToPorts from './sendMessageToPorts'

export default async () => {
  try {
    /* 
      Get all exist accounts
    */
    const allAccounts = await backgroundAccount.getAllAccounts()
    allAccounts.forEach(async (account) => {
      /* 
        Get all pending transactions of each account
      */
      let pendingTransactions = await account.get.pendingTransactions()

      /* 
        Check for expired or confirmed.
        Expired: dropped true
        Confirmed: confirmed true
      */
      pendingTransactions = await Promise.all(
        pendingTransactions.map(async (transaction) => {
          /* 
          Don't need to check the status for expired transaction
        */
          if (!transaction.expired) {
            const isNFT = includes(transaction.activityName, 'Minted NFT')
            let status
            if (includes(transaction.activityName, 'Bridged')) {
              status = await account.method.getBridgeStatus(transaction.id)
            } else {
              status = await account.method.transactionConfirmedStatus(transaction.id)
            }
            const { dropped, confirmed } = status

            /* 
            if retried <= MAX_RETRIED, silently resend transaction
            if retried > MAX_RETRIED, notice user with an expired transaction
          */
            if (dropped) {
              if (transaction.retried < MAX_RETRIED) {
                return await account.method.resendTransaction(transaction.id)
              } else {
                if (transaction.expired !== true) {
                  transaction.expired = true
                  if (isNFT) {
                    // set expired true for the pending nft
                    let pendingAssets = await account.get.pendingAssets()
                    pendingAssets = pendingAssets.map((nft) => {
                      if (nft.txId === transaction.id) nft.expired = true
                      return nft
                    })

                    await account.set.pendingAssets(pendingAssets)
                  }
                }
              }
            }

            if (confirmed) {
              console.log('Transaction confirmed', transaction)
              let blockUrl
              if (!transaction.network) {
                blockUrl = `${PATH.VIEW_BLOCK_TRANSACTION}/${transaction.id}`
              } else {
                if (transaction.network === ETH_NETWORK_PROVIDER.MAINNET)
                  blockUrl = `${URL.ETHERSCAN_MAINNET}/tx/${transaction.id}`
                if (transaction.network === ETH_NETWORK_PROVIDER.RINKEBY)
                  blockUrl = `${URL.ETHERSCAN_RINKEBY}/tx/${transaction.id}`
              }

              if (includes(transaction.activityName, 'SOL')) {
                blockUrl = `${URL.SOLANA_EXPLORE}/tx/${transaction.id}?cluster=${transaction.network}`
              }
              const message = {
                title: `Transaction confirmed`,
                message: `${transaction.activityName} has been confirmed`,
                txId: transaction.id,
                new: true,
                date: transaction.timestamp || Date.now(),
                blockUrl: blockUrl
              }

              showNotification(message)

              const notifications = await storage.generic.get.pushNotification()
              notifications.unshift(message)
              await storage.generic.set.pushNotification(notifications)

              sendMessageToPorts(cache.getPopupPorts())({
                type: MESSAGES.PUSH_NOTIFICATIONS,
                payload: message
              })

              if (
                get(transaction, 'transactionType') === PENDING_TRANSACTION_TYPE.CREATE_DID_DATA
              ) {
                try {
                  console.log('Call hook: ', get(transaction, 'data.reactAppId'))
                  const reactAppId = get(transaction, 'data.reactAppId')
                  await did.kidHookCall(reactAppId)
                } catch (err) {
                  console.error(err.message)
                }
              }

              if (get(transaction, 'transactionType') === PENDING_TRANSACTION_TYPE.UPDATE_KID) {
                try {
                  console.log('Re-register KID', get(transaction, 'data.kID'))
                  const { txId, kID } = get(transaction, 'data')
                  if (txId && kID) {
                    await did.koiiMe.mapKoiiMe({ txId, kID, account })
                  }
                } catch (err) {
                  console.error(err.message)
                }
              }

              if (get(transaction, 'transactionType') === PENDING_TRANSACTION_TYPE.UPDATE_DID) {
                try {
                  console.log('Call hook: ', get(transaction, 'data.reactAppId'))
                  const reactAppId = get(transaction, 'data.reactAppId')
                  await did.kidHookCall(reactAppId)
                } catch (err) {
                  console.error(err.message)
                }
              }
              return
            }
          }
          return transaction
        })
      )

      pendingTransactions = pendingTransactions.filter((transaction) => !!transaction)
      await account.set.pendingTransactions(pendingTransactions)
    })
  } catch (err) {
    console.log('Update pending transaction error: ', err.message)
  }
}
