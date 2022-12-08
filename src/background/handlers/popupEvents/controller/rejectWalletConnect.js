import walletConnect from 'services/walletConnect'

export default async (payload, next) => {
  try {
    const { proposal } = payload.data
    await walletConnect.reject(proposal)

    next()
  } catch (err) {
    console.log(err.message)
    next({ error: 'Reject WalletConnect error' })
  }
}
