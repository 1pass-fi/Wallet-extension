// Services
import { backgroundAccount } from 'services/account'

import helpers from 'background/helpers'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'


export default async (payload, next) => {
  try {
    const { collectionData, address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    const txId = await helpers.collections.createCollection(collectionData, account)

    // create pending transaction for collection
    const pendingTransaction = {
      id: txId,
      activityName: `Created Collection "${collectionData.name}"`,
      expense: 0.00004,
      address,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.CREATE_COLLECTION,
      data: { collectionData }
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransaction)

    next({ data: txId })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
