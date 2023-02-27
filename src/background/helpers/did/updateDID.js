// constants
import { POPUP_CONTROLLER_ERROR } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'
import { ArweaveAccount } from 'services/account/Account'
// services
import arweave from 'services/arweave'
import { smartweave } from 'smartweave'

import didSchema from './schema'

export default async (payload, txId, account) => {
  if (!(account instanceof ArweaveAccount))
    throw new Error(POPUP_CONTROLLER_ERROR.DID_INVALID_ACCOUNT)
  const ownerAddress = await account.get.address()

  let data = didSchema.validate(payload, {})

  if (data.error) {
    console.error(data.error)
    throw new Error(POPUP_CONTROLLER_ERROR.DID_INVALID_DATA)
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
