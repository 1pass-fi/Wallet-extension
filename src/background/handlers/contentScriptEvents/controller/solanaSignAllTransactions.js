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
 
    next({ data: 'example_signed_transactions' })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signAllTransactions error' } })
  }
}
