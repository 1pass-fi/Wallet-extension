// Services
import { backgroundAccount } from 'services/account'

import helpers from 'background/helpers'


export default async (payload, next) => {
  try {
    const { collectionData, address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)
    const txId = await helpers.collections.createCollection(collectionData, account)
    next({ data: txId })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
