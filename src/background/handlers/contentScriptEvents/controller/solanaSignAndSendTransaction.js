import base58 from 'base58'
import { Transaction, sendAndConfirmTransaction } from '@solana/web3.js'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const {
      origin,
      favicon,
      url,
      hadPermission,
      hasPendingRequest,
      siteAddressDictionary,
      activatedAddress
    } = tab

    console.log('SOLANA SIGN ALL TRANSACTIONS...')

    const defaultSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()

    console.log('default solana address', defaultSolanaAddress)
    const credential = backgroundAccount.getCredentialByAddress(defaultSolanaAddress)
    console.log('credential', credential)

    const transaction = new Transaction(base58.decode(payload))

    // TODO: Get connection and keypair

    const receipt = await sendAndConfirmTransaction(connection, transaction, [keypair])

    next({ data: receipt })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signAndSendTransaction error' } })
  }
}
