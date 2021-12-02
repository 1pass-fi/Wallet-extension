import { isString } from 'lodash'
// Services
import { backgroundAccount } from 'services/account'


export default async (_, next) => {
  try {
    const allAccounts = await backgroundAccount.getAllAccounts()
    await Promise.all(allAccounts.map(async account => {
      const fetchedCollections = await account.method.loadCollections()
      if (!isString(fetchedCollections)) await account.set.collections(fetchedCollections)
    }))

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Load collection error' })
  }
}
