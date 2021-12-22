import { ArweaveAccount } from 'services/account/Account'
import arweave from 'services/arweave'

import collectionSchema from './schema'

export default async (payload, account) => {
  if (!(account instanceof ArweaveAccount)) throw new Error('Invalid account input')

  let collectionData = collectionSchema.validate(payload)
  if (collectionData.error) throw new Error(collectionData.error.message)
  collectionData = collectionData.value

  const tx = await arweave.createTransaction({
    data: Buffer.from(collectionData.owner)
  })
  tx.addTag('Content-Type', 'text/plain')
  tx.addTag('Network', 'Koii')
  tx.addTag('Action', 'Collection/Create')
  tx.addTag('App-Name', 'SmartWeaveContract')
  tx.addTag('App-Version', '0.1.0')
  tx.addTag('Contract-Src', 'NCepV_8bY831CMHK0LZQAQAVwZyNKLalmC36FlagLQE')
  tx.addTag('Wallet-Address', collectionObject.owner)
  tx.addTag('Init-State', JSON.stringify(collectionData))

  await arweave.transactions.sign(tx, account.getKey())
  const uploader = await arweave.transactions.getUploader(tx)
  await uploader.uploadChunk()

  return tx.id
}
