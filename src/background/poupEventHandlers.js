import { MESSAGES } from 'constants'
import { loadWallet, saveWalletToChrome } from 'utils'
import { LOAD_KOI_BY } from '../constants'

export default async (koi, port, message) => {
  try {
    switch (message.type) {
      case MESSAGES.IMPORT_WALLET: {
        const { inputData: { data }, password } = message.data
        const koiData = await loadWallet(koi, data, LOAD_KOI_BY.KEY)
        await saveWalletToChrome(koi, password)
        port.postMessage({
          type: MESSAGES.IMPORT_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      default:
        break
    }
  } catch (err) {
    console.log(err)
    port.postMessage({
      type: MESSAGES.ERROR,
      data: err.message
    })
  }
}
