// Services
import storage from 'services/storage'
import { backgroundAccount } from 'services/account'

// Constants
import { MESSAGES } from 'constants/koiConstants'

import helpers from 'background/helpers'


export default async (payload, next) => {
  try {
    const { address, newName } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    await account.set.accountName(newName)

    // change accountName for activities
    let activities = await account.get.activities()
    activities = activities.map(activity => {
      activity.accountName = newName
      return activity
    })
    await account.set.activities(activities)

    // change accountName for allActivities
    let allActivities = await storage.generic.get.allActivities()
    allActivities = allActivities.map(activity => {
      if (activity?.address === address) activity.accountName = newName
      return activity
    })
    await storage.generic.set.allActivities(allActivities)

    // change accountName for pending transactions
    let pendingTransactions = await account.get.pendingTransactions()
    pendingTransactions = pendingTransactions.map(transaction => {
      transaction.accountName = newName
      return transaction
    })

    next()

    helpers.sendMessageToPopupPorts({ type: MESSAGES.RELOAD_GALLERY })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Change account name error' })
  }
}
