import { Message, Transaction } from '@solana/web3.js'
import base58 from 'bs58'
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

    console.log('SOLANA SIGN ALL TRANSACTIONS...')

    console.log('payload', payload)

    const credentials = await backgroundAccount.getCredentialByAddress(connectedAddresses)
    const solTool = new SolanaTool(credentials)
    const keypair = solTool.keypair

    const messages = payload.data
    const transactions = await Promise.all(messages.map(async (message) => {
      const _message = Message.from(base58.decode(message))
      const transaction = Transaction.populate(_message)
      transaction.sign(keypair)
      console.log('signed transaction===', transaction)

      return transaction.signatures
    }))

    console.log('transactions', transactions)

    // TODO Thuan Ngo: implement signAllTransactions functions
    //  could consider to mock this function aWet the moment

    /* listOfTransactions will be an array of encoded transactions

      *** Before send to Finnie: const message = transactions.map(transaction => {
          return bs58.encode(transaction.serializeMessage());
      });

      *** Send message to Finnie:
      window.solana.signAllTransactions(message)
    */

    // For further reference: https://docs.phantom.app/integrating/extension-and-mobile-browser/sending-a-transaction

    // For signTransaction it should work the same way except that we only sign a single transaction
 
    next({ data: transactions })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signAllTransactions error' } })
  }
}
