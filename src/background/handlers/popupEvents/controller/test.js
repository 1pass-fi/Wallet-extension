import helpers from 'background/helpers'
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { kID, txId, address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    await helpers.did.koiiMe.updateKoiiMe(kID, txId, account)

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
