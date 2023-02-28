import { backgroundAccount } from 'services/account'
import arweave from 'services/arweave'
import { smartweave } from 'smartweave'

export default async (payload, next) => {
  try {
    const { sender, customTokenRecipient, contractAddress, rawValue } = payload.data

    const credentials = await backgroundAccount.getCredentialByAddress(sender)

    const input = {
      function: 'transfer',
      qty: rawValue,
      target: customTokenRecipient
    }
    const txId = await smartweave.interactWrite(arweave, credentials.key, contractAddress, input)

    next({ data: txId })
  } catch (err) {
    next({ error: err.message })
  }
}
