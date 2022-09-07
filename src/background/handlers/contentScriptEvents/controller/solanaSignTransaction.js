import { Message,Transaction } from '@solana/web3.js'
import base58 from 'bs58'
import get from 'lodash/get'
import { backgroundAccount } from 'services/account'
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
      activatedAddress,
      connectedAddresses
    } = tab

    const encodedMessage = get(payload, 'data')

    const credentials = await backgroundAccount.getCredentialByAddress(connectedAddresses)
    const solTool = new SolanaTool(credentials)
    const keypair = solTool.keypair

    const transactionMessage = Message.from(base58.decode(encodedMessage))
    const transaction = Transaction.populate(transactionMessage)

    transaction.sign(keypair)
    const encodedSignedTransaction = base58.encode(transaction.serialize())

    next({ data: encodedSignedTransaction })
  } catch (err) {
    console.error(err)
    next({ data: { status: 500, data: 'Solana signTransaction error' } })
  }
}
