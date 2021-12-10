import { smartweave } from 'smartweave'

// services
import arweave from 'services/arweave'
import { backgroundAccount } from 'services/account'
import { ArweaveAccount } from 'services/account/Account'

// constants
import { ERROR_MESSAGE } from 'constants/koiConstants'

import didSchema from './schema'

export default async (payload, txId, account) => {
  if (!(account instanceof ArweaveAccount)) throw new Error(ERROR_MESSAGE.DID.INVALID_ACCOUNT_INPUT)
  const ownerAddress = await account.get.address()

  let data = didSchema.validate(payload, {})

  if (data.error) {
    console.error(data.error)
    throw new Error(ERROR_MESSAGE.DID.INVALID_DATA_INPUT)
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
