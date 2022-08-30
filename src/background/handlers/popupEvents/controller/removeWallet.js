// Services
// helpers
import helpers from 'background/helpers'
// Constants
import { MESSAGES } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { address } = payload.data

    await backgroundAccount.removeAccount(address)
    
    helpers.loadActivities()
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
