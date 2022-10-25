import helpers from 'background/helpers'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import showNotification from 'utils/notifications'
import { ethers } from 'ethers'

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, rawValue } = payload.data

    const credential = await backgroundAccount.getCredentialByAddress(ethers.utils.getAddress(sender))
    const account = await backgroundAccount.getAccount(credential)
    const network = await storage.setting.get.ethereumProvider()

    const { txHash, sendingPromise, symbol, decimals } = await account.method.transferToken({
      tokenContractAddress: contractAddress,
      to: customTokenRecipient,
      value: rawValue
    })

    const pendingTransactionPayload = {
      id: txHash,
      activityName: `Sent ${symbol}`,
      expense: rawValue / Math.pow(10, decimals),
      target: customTokenRecipient,
      address: sender,
      network,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.SEND_KOII,
      isK2Account: false,
      isProcessing: true
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransactionPayload)

    const updateTransaction = async () => {
      let pendingTransactions = await account.get.pendingTransactions()

      pendingTransactions = pendingTransactions.map((transaction) => {
        if (transaction.id === txHash) {
          transaction.isProcessing = false
        }
        return transaction
      })
      await account.set.pendingTransactions(pendingTransactions)
    }

    const removeTransaction = async () => {
      let pendingTransactions = await account.get.pendingTransactions()
      pendingTransactions = pendingTransactions.filter(transaction => {
        return transaction.id !== txHash
      })
      await account.set.pendingTransactions(pendingTransactions)

      const message = {
        title: 'Failed to send your transaction',
        message: `Transaction ID: ${txHash}`,
        txId: txHash,
        new: true,
        date: Date.now()
      }

      showNotification(message)

      const notifications = await storage.generic.get.pushNotification()
      notifications.unshift(message)
      await storage.generic.set.pushNotification(notifications)
    }

    sendingPromise.then(() => {
      console.log('transaction processing completed')
      updateTransaction()
    }).catch(() => {
      console.log('transaction processing failed, remove the transaction')
      removeTransaction()
    })

    next({ data: txHash })

  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
