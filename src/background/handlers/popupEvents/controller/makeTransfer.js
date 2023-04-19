// Services
import helpers from 'background/helpers'
// Constants
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import get from 'lodash/get'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import showNotification from 'utils/notifications'

export default async (payload, next) => {
  try {
    const { qty, target, token, address, maxPriorityFeePerGas, maxFeePerGas } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    const transactionType =
      token === 'KOI' ? PENDING_TRANSACTION_TYPE.SEND_KOII : PENDING_TRANSACTION_TYPE.SEND_AR

    console.log('QTY ', qty, 'TARGET ', target, 'TOKEN', token)

    let txId = ''
    let receipt = {}

    if (token === 'ETH') {
      receipt = await account.method.transfer(
        token,
        target,
        qty,
        maxPriorityFeePerGas,
        maxFeePerGas
      )
      txId = receipt.txHash
    } else if (token === 'KOI') {
      txId = await account.method.transfer(token, target, qty)
    } else if (token === 'SOL') {
      txId = await account.method.transfer(token, target, qty)
    } else if (token === 'KOII') {
      txId = await account.method.transfer(token, target, qty)
    } else if (token === 'AR') {
      txId = await account.method.transfer(token, target, qty)
    }

    let network
    if (token === 'ETH') {
      network = await storage.setting.get.ethereumProvider()
      network = get(network, 'rpcUrl') || network
    } else if (token === 'SOL') {
      network = await storage.setting.get.solanaProvider()
    }

    // add new pending transaction
    const pendingTransactionPayload = {
      id: txId,
      activityName: token === 'KOI' ? 'Sent KOII' : `Sent ${token}`,
      expense: qty,
      target,
      address,
      network,
      retried: 1,
      transactionType,
      isK2Account: token === 'KOII',
      isProcessing: token === 'ETH'
    }

    if (token !== 'KOII') {
      await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransactionPayload)
    }

    const updateTransaction = async () => {
      let pendingTransactions = await account.get.pendingTransactions()

      pendingTransactions = pendingTransactions.map((transaction) => {
        if (transaction.id === txId) {
          transaction.isProcessing = false
        }
        return transaction
      })

      await account.set.pendingTransactions(pendingTransactions)
    }

    const removeTransaction = async () => {
      let pendingTransactions = await account.get.pendingTransactions()
      pendingTransactions = pendingTransactions.filter((transaction) => {
        return transaction.id !== txId
      })
      await account.set.pendingTransactions(pendingTransactions)

      const message = {
        title: 'Failed to send your transaction',
        message: `Transaction ID: ${txId}`,
        txId: txId,
        new: true,
        date: Date.now()
      }

      showNotification(message)

      const notifications = await storage.generic.get.pushNotification()
      notifications.unshift(message)
      await storage.generic.set.pushNotification(notifications)
    }

    if (token === 'ETH') {
      receipt?.sendingPromise
        .then(() => {
          console.log('transaction processing completed')
          updateTransaction()
        })
        .catch(() => {
          console.log('transaction processing failed, remove the transaction')
          removeTransaction()
        })
    }

    helpers.loadBalances()
    helpers.loadActivities()

    next({ data: txId })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
