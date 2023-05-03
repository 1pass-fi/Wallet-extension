import helpers from 'background/helpers'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { ethers } from 'ethers'
import get from 'lodash/get'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import showNotification from 'utils/notifications'

export default async (payload, next) => {
  try {
    const { 
      sender,
      customTokenRecipient, 
      contractAddress, 
      rawValue,
      maxPriorityFeePerGas,
      maxFeePerGas 
    } = payload.data

    const credential = await backgroundAccount.getCredentialByAddress(ethers.utils.getAddress(sender))
    const account = await backgroundAccount.getAccount(credential)
    let network = await storage.setting.get.ethereumProvider()
    network = get(network, 'rpcUrl') || network

    const { txHash, sendingPromise, symbol, decimals } = await account.method.transferToken({
      tokenContractAddress: contractAddress,
      to: customTokenRecipient,
      value: rawValue,
      maxPriorityFeePerGas,
      maxFeePerGas
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

    if (network === 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2' || network === 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2') {
      await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransactionPayload)
    }

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
