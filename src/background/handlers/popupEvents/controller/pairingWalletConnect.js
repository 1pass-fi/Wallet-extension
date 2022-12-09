import walletConnect from 'services/walletConnect'

export default async (payload, next) => {
  try {
    const { uri } = payload.data
    await walletConnect.pair(uri)

    next()
  } catch (err) {
    console.log('Fail to pair through walletconnect: ',err.message)
    next({ error: err.message })
  }
}
