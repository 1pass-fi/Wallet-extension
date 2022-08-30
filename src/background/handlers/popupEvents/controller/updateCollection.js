// Services
import helpers from 'background/helpers'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { collectionData, collectionId, address } = payload.data

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    const txId = await helpers.collections.updateCollection(collectionData, collectionId, account)

    const pendingTransaction = {
      id: txId,
      activityName: `Updated Collection "${collectionData.name}"`,
      expense: 0.00004,
      address,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.UPDATE_COLLECTION,
      data: { collectionData, collectionId }
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransaction)

    next({ data: txId })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
