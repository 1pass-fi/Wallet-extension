// constants
import { backgroundAccount } from 'services/account'
import { ArweaveAccount } from 'services/account/Account'
// services
import arweave from 'services/arweave'
import { smartweave } from 'smartweave'

import didSchema from './schema'

export default async (payload, txId, account) => {
  if (!(account instanceof ArweaveAccount))
    throw new Error(chrome.i18n.getMessage('didInvalidAccount'))
  const ownerAddress = await account.get.address()

  let data = didSchema.validate(payload, {})

  if (data.error) {
    console.error(data.error)
    throw new Error(chrome.i18n.getMessage('didInvalidData'))
  }

  data = data.value

  const { key: walletKey } = await backgroundAccount.getCredentialByAddress(ownerAddress)

  return await smartweave.interactWrite(
    arweave,
    walletKey,
    txId,
    {
      function: 'updateData',
      data,
    }
  )
}
