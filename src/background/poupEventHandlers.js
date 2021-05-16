import { MESSAGES, LOAD_KOI_BY } from 'constants'
import { 
  saveWalletToChrome, 
  utils, 
  removeWalletFromChrome,
  decryptWalletKeyFromChrome,
  setChromeStorage
} from 'utils'

export default async (koi, port, message) => {
  try {
    switch (message.type) {
      case MESSAGES.IMPORT_WALLET: {
        const { data, password } = message.data
        const koiData = await utils.loadWallet(koi, data, LOAD_KOI_BY.KEY)
        await saveWalletToChrome(koi, password)
        port.postMessage({
          type: MESSAGES.IMPORT_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.LOAD_WALLET: {
        const { data } = message.data
        const koiData = await utils.loadWallet(koi, data, LOAD_KOI_BY.ADDRESS)
        port.postMessage({
          type: MESSAGES.LOAD_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.REMOVE_WALLET: {
        const koiData = {
          arBalance: null,
          koiBalance: null,
          address: null
        }
        await removeWalletFromChrome()
        koi.wallet = null
        koi.address = null
        port.postMessage({
          type: MESSAGES.REMOVE_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.UNLOCK_WALLET: {
        const { password } = message.data
        const walletKey = await decryptWalletKeyFromChrome(password)
        const koiData = await utils.loadWallet(koi, walletKey, LOAD_KOI_BY.KEY)
        await setChromeStorage({ 'koiAddress': koi.address })
        port.postMessage({
          type: MESSAGES.UNLOCK_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      default:
        break
    }
  } catch (err) {
    port.postMessage({
      type: MESSAGES.ERROR,
      data: err.message
    })
  }
}
