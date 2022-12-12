import walletConnect from 'services/walletConnect'

export default async (payload, next) => {
  try {
    const { proposal, payloadData } = payload.data
    await walletConnect.approve(proposal, payloadData)

    next()
  } catch (err) {
    console.log(err.message)
    next({ error: 'Approve WalletConnect error' })
  }
}
