import { smartweave } from 'smartweave'

import arweave from 'services/arweave'
import { ArweaveAccount } from 'services/account/Account'
import collectionSchema from './schema'

export default async (collection, contractId, account) => {
  if (!(account instanceof ArweaveAccount)) throw new Error('Invalid account input')

  let data = collectionSchema.validate(collection)
  if (data.error) throw new Error(data.error)

  data = data.value

  return smartweave.interactWrite(arweave, account.getKey(), contractId, {
    function: 'updateCollection',
    ...data
  })
}
