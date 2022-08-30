// Services
// helpers
import helpers from 'background/helpers'
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { password } = payload.data

    // send error if password is incorrect
    try {
      await backgroundAccount.unlockImportedAccount(password)
    } catch (err) {
      next({ error: err.message })
      return
    }

    helpers.loadBalances()
    helpers.loadActivities()
    
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
