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
 
    next({ data: 'example_signed_transaction' })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signTransaction error' } })
  }
}
