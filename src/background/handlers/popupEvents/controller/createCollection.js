// Services
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { nftIds, collectionInfo, address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    const txId = await account.method.createCollection(collectionInfo, nftIds)

    next({ data: txId })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Create collection error' })
  }
}
