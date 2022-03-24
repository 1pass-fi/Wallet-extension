import { normalize } from '@metamask/eth-sig-util'

export default (payload, tab, next) => {
  try {
    const { connectedAddresses } = tab

    next({ data: connectedAddresses.map(normalize) })
  } catch (err) {
    next({ error: err.message })
  }
}
