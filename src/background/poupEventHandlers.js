import { MESSAGES, loadKoiBy } from 'constant'
import { loadWallet, saveWalletToChrome } from 'utils'

export default async (koi, port, message) => {
  switch (message.type) {
    case MESSAGES.IMPORT_WALLET: {
      const { object, password, from } = message.data
      const koiData = await loadWallet(koi, object, from)
      await saveWalletToChrome(koi, password)
      port.postMessage({
        type: MESSAGES.IMPORT_WALLET_SUCCESS,
        data: {
          koiData,
          from
        }})
      break
    }
    default:
      break
  }
}
