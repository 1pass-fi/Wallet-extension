import { smartweave } from 'smartweave'

import arweave from 'services/arweave'
import { ArweaveAccount } from 'services/account/Account'

export default async (collection, contractId, account) => {
  if (!(account instanceof ArweaveAccount)) throw new Error('Invalid account input')

  return smartweave.interactWrite(arweave, account.getKey(), contractId, {
    function: 'updateCollection',
    collection
  })
}
