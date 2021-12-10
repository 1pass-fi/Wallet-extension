import { smartweave } from 'smartweave'

import helpers from 'background/helpers'

// Services
import arweave from 'services/arweave'


export default async (payload, next) => {
  try {
    const { address } = payload.data

    const txId = await helpers.did.getDID(address)

    if (!txId) {
      next({ error: 'DID not found' })
      return
    }

    const state = await smartweave.readContract(arweave, txId)

    next({ data: { state: state.data, id: txId } })
  } catch (err) {
    console.log(err.message)
    next({ error: 'Get DID error' })
  }
}
