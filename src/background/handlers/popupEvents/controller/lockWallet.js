// Services
import helpers from 'background/helpers'
import { MESSAGES } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    await backgroundAccount.removeAllImported()
    await backgroundAccount.removeConnectedSite()

    helpers.sendMessageToPopupPorts({ type: MESSAGES.RELOAD_GALLERY })
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Lock wallet error' })
  }
}
