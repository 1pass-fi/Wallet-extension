// Services
import helpers from 'background/helpers'
// Constants
import { MESSAGES } from 'constants/koiConstants'
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { solanaProvider, isGalleryRequest } = payload.data
    const currentSolanaProvider = await storage.setting.get.solanaProvider()

    if (solanaProvider !== currentSolanaProvider) {
      console.log('updateSolanaProvider ', solanaProvider)
      await storage.setting.set.solanaProvider(solanaProvider)

      if (!isGalleryRequest) {
        helpers.sendMessageToPopupPorts({ type: MESSAGES.RELOAD_GALLERY })
      }
    }
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Update Solana Provider error' })
  }
}
