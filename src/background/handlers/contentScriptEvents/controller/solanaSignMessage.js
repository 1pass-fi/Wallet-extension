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

    // TODO Thuan Ngo: implement signMessage functions
    // Let's implement this endpoint in the next integration

    console.log('SOLANA SIGN MESSAGE...')
 
    next({ data: 'example_message' })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana signMessage error' } })
  }
}
