// Services
import { backgroundAccount } from 'services/account'
import arweave from 'services/arweave'


export default async (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress } = tab
    let { hashBuffer } = payload.data

    const { key } = await backgroundAccount.getCredentialByAddress(activatedAddress)
    hashBuffer = Uint8Array.from(Object.values(hashBuffer))

    if (hadPermission) {
      const buf = await arweave.crypto.sign(key, hashBuffer, { saltLength: 32 })
      next({ data: buf, status: 200 })
    } else {
      next({ data: { status: 400, data: 'Do not have permissions.' } })
    }
  } catch (err) {
    console.error(err.mesage)
    next({ data: { status: 500, data: 'Signature error' } })
  }
}
