// Services
import { backgroundAccount } from 'services/account'

// Constants
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'

import helpers from 'background/helpers'

export default async (payload, next) => {
  try {
    const { qty, target, token, address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    const transactionType =
      token === 'KOI' ? PENDING_TRANSACTION_TYPE.SEND_KOII : PENDING_TRANSACTION_TYPE.SEND_AR

    console.log('QTY ', qty, 'TARGET ', target, 'TOKEN', token)

    let txId = ''
    let receipt = {}

    if (token === 'ETH') {
      receipt = await account.method.transfer(token, target, qty)
      txId = receipt.transactionHash
    } else if (token === 'KOI') {
      txId = await account.method.transfer(token, target, qty)
    } else if (token === 'SOL') {
      txId = await account.method.transfer(token, target, qty)
    } else if (token === 'KOII') {
      txId = await account.method.transfer(token, target, qty)
    }

    const network = await account.get.provider()

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
      isK2Account: token === 'KOII'
    }
    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransactionPayload)

    helpers.loadBalances()
    helpers.loadActivities()

    next({ data: { txId, receipt } })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
