// Services
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { address } = payload.data
    const credentials = await backgroundAccount.getCredentialByAddress(address)
    const account = await backgroundAccount.getAccount(credentials)

    const kidData = await account.method.loadKID()

    await account.set.kid(kidData)
    next({ data: kidData })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Load DID error' })
  }
}
