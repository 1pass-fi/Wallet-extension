// Services
import helpers from 'background/helpers'
import { backgroundAccount } from 'services/account'

export default async (_, next) => {
  try {
    // const allAccounts = await backgroundAccount.getAllAccounts()
    // await Promise.all(
    //   allAccounts.map(async (account) => {
    //     const { fetchedCollections, collectionNfts } = await helpers.collections.getCollections(account)
    //     await account.set.collections(fetchedCollections)
    //     await account.set.collectionNfts(collectionNfts)
    //   })
    // )
    console.log('get collections')
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
