import bs58 from 'bs58'
import { Transaction, sendAndConfirmTransaction, Message, Connection, clusterApiUrl } from '@solana/web3.js'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import { SolanaTool } from 'services/solana'

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
    const defaultSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()

    const credential = await backgroundAccount.getCredentialByAddress(defaultSolanaAddress)

    const transactionMessage = Message.from(bs58.decode(payload.data))
    const transaction = Transaction.populate(transactionMessage)

    const solanaProvider = await storage.setting.get.solanaProvider()
    const connection = new Connection(clusterApiUrl(solanaProvider), 'confirmed')
    const tool = new SolanaTool(credential)

    const signature = await sendAndConfirmTransaction(connection, transaction, [tool.keypair])

    next({ data: signature })
  } catch (err) {
    console.error(err)
    next({ data: { status: 500, data: 'Solana signAndSendTransaction error' } })
  }
}
