import { Transaction } from '@solana/web3.js'
import base58 from 'bs58'

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

    // TODO Thuan Ngo: implement signTransaction functions
    // Take a look at controller: signAllTransactions
    console.log('SOLANA SIGN TRANSACTION...')
    const params = get(payload, 'data.params')
    const encodeTransaction = get(params, 'transaction')

    const credentials = await backgroundAccount.getCredentialByAddress(connectedAddresses)
    const solTool = new SolanaTool(credentials)
    const keypair = solTool.keypair

    const transaction = Transaction.from(base58.decode(encodeTransaction))
    transaction.sign(keypair)

    next({ data: transaction })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signTransaction error' } })
  }
}
