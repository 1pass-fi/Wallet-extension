import { orderBy } from 'lodash'
import { backgroundAccount } from 'services/account'
// Services
import storage from 'services/storage'


export default async (type) => {

  const accountsForInputType = await backgroundAccount.getAllAccounts(type) // all accounts if !type
  await Promise.all(accountsForInputType.map(async account => {
    console.log('AccountName: ', await account.get.accountName(), account)
    await account.method.updateActivities()
  }))

  // UPDATE ALL ACTIVITIES ON STORAGE
  let allActivities = []
  const allAccounts = await backgroundAccount.getAllAccounts()

  for (let i = 0; i < allAccounts.length; i++) {
    const activities = await allAccounts[i].get.activities()
    allActivities = [...allActivities, ...activities]
  }

  allActivities = orderBy(allActivities, 'time', 'desc')
  console.log('ACTIVITIES LOADED: ', allActivities.length)
  await storage.generic.set.allActivities(allActivities)

}
