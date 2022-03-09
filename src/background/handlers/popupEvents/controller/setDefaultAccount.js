// Services
import storage from 'services/storage'

import { setActivatedAccountAddress } from 'utils'


export default async (payload, next) => {
  try {
    const { address } = payload.data
    await setActivatedAccountAddress(address)

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
