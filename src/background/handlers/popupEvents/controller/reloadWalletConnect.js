import walletConnect from 'services/walletConnect'

export default async (_, next) => {
  try {
    await walletConnect.reload()
    next()
  } catch (err) {
    console.log(err.message)
    next({ error: 'Reload WalletConnect error' })
  }
}
