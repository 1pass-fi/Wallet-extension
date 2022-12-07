import walletConnect from 'services/walletConnect'

export default async (payload, next) => {
  try {
    const { uri } = payload.data
    await walletConnect.pair(uri)

    next()
  } catch (err) {
    console.log(err.message)
    next({ error: 'Pair WalletConnect error' })
  }
}
