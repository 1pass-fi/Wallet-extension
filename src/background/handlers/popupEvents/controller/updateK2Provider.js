// Services
import helpers from 'background/helpers'
// Constants
import { MESSAGES } from 'constants/koiConstants'
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { k2Provider, isGalleryRequest } = payload.data
    const currentK2Provider = await storage.setting.get.k2Provider()

    if (k2Provider !== currentK2Provider) {
      await storage.setting.set.k2Provider(k2Provider)

      if (!isGalleryRequest) {
        helpers.sendMessageToPopupPorts({ type: MESSAGES.RELOAD_GALLERY })
      }
    }
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Update K2 Provider error' })
  }
}
