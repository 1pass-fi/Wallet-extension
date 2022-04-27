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

    // TODO Thuan Ngo: implement disconnect functions
    // We could consider to mock this function at the moment

    console.log('SOLANA DISCONNECT...')
 
    next({ data: 'Disconnected' })
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Solana disconnect error' } })
  }
}
