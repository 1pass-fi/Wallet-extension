// Services
import { backgroundAccount } from 'services/account'

// Constants
import { MESSAGES } from 'constants/koiConstants'

// helpers
import helpers from 'background/helpers'

export default async (payload, next) => {
  try {
    const { address } = payload.data

    await backgroundAccount.removeAccount(address)
    
    helpers.sendMessageToPopupPorts({ type: MESSAGES.RELOAD_GALLERY })
    helpers.loadActivities()
    
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
