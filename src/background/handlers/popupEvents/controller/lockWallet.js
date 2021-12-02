// Services
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    await backgroundAccount.removeAllImported()
    await backgroundAccount.removeConnectedSite()

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Lock wallet error' })
  }
}
