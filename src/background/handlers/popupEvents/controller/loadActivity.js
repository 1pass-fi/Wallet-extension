// Services
import { backgroundAccount } from 'services/account'

// Constants
import { MESSAGES } from 'constants/koiConstants'


export default async (payload, next) => {
  try {
    const { cursor, address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const { activitiesList, nextOwnedCursor, nextRecipientCursor } = await account.method.loadMyActivities(cursor)

    // filter pending transactions
    let pendingTransactions = await account.get.pendingTransactions() || []
    pendingTransactions = pendingTransactions.filter(tx => {
      return activitiesList.every(activity => activity.id !== tx.id)
    })
    await account.set.pendingTransactions(pendingTransactions)
    next({ data: { activitiesList, nextOwnedCursor, nextRecipientCursor } })
  } catch (err) {
    next({ error: err.message })
  }
}
