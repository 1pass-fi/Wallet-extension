import { ArweaveAccount } from 'services/account/Account'
import arweave from 'services/arweave'
import { smartweave } from 'smartweave'

import collectionSchema from './schema'

export default async (collectionData, contractId, account) => {
  if (!(account instanceof ArweaveAccount)) throw new Error('Invalid account input')

  let data = collectionSchema.validate(collectionData)
  if (data.error) throw new Error(data.error)

  data = data.value

  return smartweave.interactWrite(arweave, account.getKey(), contractId, {
    function: 'updateCollection',
    ...data
  })
}
