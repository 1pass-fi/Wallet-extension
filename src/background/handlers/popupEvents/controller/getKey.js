// Services
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { address } = payload.data

    const credentials = await backgroundAccount.getCredentialByAddress(address)

    next({ data: credentials.key })
  } catch (err) {
    console.log(err.message)
    next({ error: 'Get Key error' })
  }
}
