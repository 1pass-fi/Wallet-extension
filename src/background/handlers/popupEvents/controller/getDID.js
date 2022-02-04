import { smartweave } from 'smartweave'

import helpers from 'background/helpers'

// Services
import arweave from 'services/arweave'
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { address } = payload.data

    const txId = await helpers.did.getDID(address)

    if (!txId) {
      next({ error: 'DID not found' })
      return
    }

    const state = await smartweave.readContract(arweave, txId)
    const data = { state: state.data, id: txId }

    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    await account.set.didData(data)
    next({ data })
  } catch (err) {
    console.log(err.message)
    next({ error: 'Get DID error' })
  }
}
