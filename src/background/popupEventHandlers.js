import { MESSAGES, LOAD_KOI_BY, STORAGE } from 'koiConstants'
import {
  saveWalletToChrome,
  utils,
  loadMyContent,
  loadMyActivities,
  clearChromeStorage,
  decryptWalletKeyFromChrome,
  setChromeStorage,
  removeChromeStorage,
  getChromeStorage,
  generateWallet,
  transfer,
  getBalances
} from 'utils'

export const loadBalances = async (koi, port) => {
  const storage = await getChromeStorage([STORAGE.KOI_BALANCE, STORAGE.AR_BALANCE])
  const koiBalance = storage[STORAGE.KOI_BALANCE]
  const arBalance = storage[STORAGE.AR_BALANCE]
  if (koiBalance !== undefined && arBalance !== undefined) {
    if (port) {
      port.postMessage({
        type: MESSAGES.GET_BALANCES_SUCCESS,
        data: { koiData: { koiBalance, arBalance } }
      })
    }
  }
  try {
    const koiData = await getBalances(koi)
    if (port) {
      port.postMessage({
        type: MESSAGES.GET_BALANCES_SUCCESS,
        data: { koiData }
      })
    }
  } catch (error) {
    console.error(error)
  }
}

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
      case MESSAGES.GET_BALANCES: {
        loadBalances(koi, port)
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
        await clearChromeStorage()
        koi.wallet = null
        koi.address = null
        port.postMessage({
          type: MESSAGES.REMOVE_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.LOCK_WALLET: {
        await removeChromeStorage(STORAGE.KOI_ADDRESS)
        koi.address = null
        koi.wallet = null
        port.postMessage({
          type: MESSAGES.LOCK_WALLET_SUCCESS
        })

        break
      }
      case MESSAGES.UNLOCK_WALLET: {
        const { password } = message.data
        const walletKey = await decryptWalletKeyFromChrome(password)
        const koiData = await utils.loadWallet(koi, walletKey, LOAD_KOI_BY.KEY)
        await setChromeStorage({ [STORAGE.KOI_ADDRESS]: koi.address })
        port.postMessage({
          type: MESSAGES.UNLOCK_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.GENERATE_WALLET: {
        const seedPhrase = await generateWallet(koi)
        port.postMessage({
          type: MESSAGES.GENERATE_WALLET_SUCCESS,
          data: { seedPhrase }
        })
        break
      }
      case MESSAGES.SAVE_WALLET: {
        const { password } = message.data
        await saveWalletToChrome(koi, password)
        const koiData = await utils.loadWallet(koi, koi.address, LOAD_KOI_BY.ADDRESS)
        port.postMessage({
          type: MESSAGES.SAVE_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.LOAD_CONTENT: {
        const contentList = await loadMyContent(koi)
        console.log('CONTENT LIST', contentList)
        setChromeStorage({ contentList })
        port.postMessage({
          type: MESSAGES.LOAD_CONTENT_SUCCESS,
          data: { contentList }
        })
        break
      }
      case MESSAGES.LOAD_ACTIVITIES: {
        const activitiesList = await loadMyActivities(koi)
        console.log('ACTIVITIES LIST', activitiesList)
        setChromeStorage({ activitiesList })
        port.postMessage({
          type: MESSAGES.LOAD_ACTIVITIES_SUCCESS,
          data: { activitiesList }
        })
        break
      }
      case MESSAGES.MAKE_TRANSFER: {
        const { qty, address } = message.data
        const txId = await transfer(koi, qty, address)
        port.postMessage({
          type: MESSAGES.MAKE_TRANSFER_SUCCESS,
          data: { txId }
        })
        break
      }
      case MESSAGES.GET_KEY_FILE: {
        port.postMessage({
          type: MESSAGES.GET_KEY_FILE_SUCCESS,
          data: koi.wallet
        })
        break
      }
      case MESSAGES.SIGN_TRANSACTION: {
        console.log('SIGN TRANSACTION BACKGROUND')
        const { qty, address } = message.data
        const txId = await transfer(koi, qty, address)
        console.log('TRANSACTION ID', txId)
        port.postMessage({
          type: MESSAGES.SIGN_TRANSACTION_SUCCESS,
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
