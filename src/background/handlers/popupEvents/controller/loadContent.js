// Services
import { backgroundAccount } from 'services/account'

import helpers from 'background/helpers'


export default async (payload, next) => {
  try {
    let allAccounts
    const { address } = payload.data
    if (address) {
      const credentials = await backgroundAccount.getCredentialByAddress(address)
      const account = await backgroundAccount.getAccount(credentials)
      allAccounts = [account]
    } else {
      allAccounts = await backgroundAccount.getAllAccounts()
    }

    const newContentList = []

    await Promise.all(allAccounts.map(async account => {
      const { contents, newContents } = await account.method.loadMyContent()
      newContentList.push({ newContents, account })
      await helpers.saveContent.cacheNFTs(contents, account)
    }))
    next()
    
    newContentList.forEach(({ newContents, account }) => helpers.saveContent.saveNewNFTsToStorage(newContents, account))

  } catch (err) {
    console.error(err.message)
    next({ error: 'Load content error' })
  }
}
