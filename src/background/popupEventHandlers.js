import passworder from 'browser-passworder'
import { isArray } from 'lodash'

import { MESSAGES, LOAD_KOI_BY, PORTS, STORAGE } from 'koiConstants'
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
  saveOriginToChrome,
  signTransaction,
  getBalances
} from 'utils'

export const loadBalances = async (koi, port) => {
  const storage = await getChromeStorage([STORAGE.KOI_BALANCE, STORAGE.AR_BALANCE])
  const koiBalance = storage[STORAGE.KOI_BALANCE]
  const arBalance = storage[STORAGE.AR_BALANCE]
  if (koiBalance !== undefined && arBalance !== undefined) {
    if (port) {
      try {
        port.postMessage({
          type: MESSAGES.GET_BALANCES_SUCCESS,
          data: { koiData: { koiBalance, arBalance } }
        })
      } catch (error) {

      }
    }
  }
  try {
    const koiData = await getBalances(koi)
    if (port) {
      try {
        port.postMessage({
          type: MESSAGES.GET_BALANCES_SUCCESS,
          data: { koiData }
        })
      } catch (error) {

      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default async (koi, port, message, ports, resolveId) => {
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

        const createdWalletAddress = (await getChromeStorage('createdWalletAddress'))['createdWalletAddress']
        const createdWalletKey = (await getChromeStorage('createdWalletKey'))['createdWalletKey']
        const decryptedWalletKey = await passworder.decrypt(password, createdWalletKey)

        if (createdWalletAddress && decryptedWalletKey) {
          koi.address = createdWalletAddress
          koi.wallet = decryptedWalletKey
        } else {
          throw new Error('Create new wallet failed.')
        }

        await saveWalletToChrome(koi, password)
        const koiData = await utils.loadWallet(koi, koi.address, LOAD_KOI_BY.ADDRESS)
        console.log('SAVE WALLET BACKGROUND', koiData)

        port.postMessage({
          type: MESSAGES.SAVE_WALLET_SUCCESS,
          data: { koiData }
        })
        break
      }
      case MESSAGES.LOAD_CONTENT: {
        let contentList = await loadMyContent(koi)
        if (isArray(contentList)) contentList = contentList.filter(content => !!content.name)
        console.log('CONTENT LIST', contentList)
        if (contentList) setChromeStorage({ contentList })
        port.postMessage({
          type: MESSAGES.LOAD_CONTENT_SUCCESS,
          data: { contentList }
        })
        break
      }
      case MESSAGES.LOAD_ACTIVITIES: {
        const { cursor } = message.data
        const { activitiesList, nextOwnedCursor, nextRecipientCursor } = await loadMyActivities(koi, cursor)
        console.log('ACTIVITIES LIST', activitiesList)
        setChromeStorage({ activitiesList })
        port.postMessage({
          type: MESSAGES.LOAD_ACTIVITIES_SUCCESS,
          data: { activitiesList, nextOwnedCursor, nextRecipientCursor }
        })
        break
      }
      case MESSAGES.MAKE_TRANSFER: {
        const { qty, address, currency } = message.data
        console.log('QTY ', qty, 'ADDRESS ', address)
        const txId = await transfer(koi, qty, address, currency)
        console.log('BACKGROUND - TXID', txId)
        port.postMessage({
          type: MESSAGES.MAKE_TRANSFER_SUCCESS,
          data: { txId, qty, address, currency }
        })
        break
      }
      case MESSAGES.GET_KEY_FILE: {
        const { password } = message.data
        const key = await decryptWalletKeyFromChrome(password)
        port.postMessage({
          type: MESSAGES.GET_KEY_FILE_SUCCESS,
          data: key
        })
        break
      }
      case MESSAGES.CONNECT: {
        const { origin, confirm } = message.data
        const { permissionId } = resolveId
        if (confirm) {
          await saveOriginToChrome(origin)
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.KOI_CONNECT_SUCCESS,
            data: { status: 200, data: 'Connected.' },
            id: permissionId[permissionId.length - 1],
          })
        } else {
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.KOI_CONNECT_SUCCESS,
            data: { status: 401, data: 'Connection rejected.' },
            id: permissionId[permissionId.length - 1],
          })
        }
        removeChromeStorage(STORAGE.PENDING_REQUEST)
        port.postMessage({
          type: MESSAGES.CONNECT_SUCCESS,
        })
        ports[PORTS.CONTENT_SCRIPT].postMessage({
          type: MESSAGES.CONNECT_SUCCESS,
          id: permissionId[permissionId.length - 1],
        })

        permissionId.length = 0
        break
      }
      case MESSAGES.SIGN_TRANSACTION: {
        const { createTransactionId } = resolveId
        const { tx, confirm } = message.data
        let transaction = null
        if (confirm) {
          transaction = await signTransaction(koi, tx)
          port.postMessage({
            type: MESSAGES.SIGN_TRANSACTION_SUCCESS,
          })
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.CREATE_TRANSACTION_SUCCESS,
            id: createTransactionId[createTransactionId.length - 1],
            data: transaction
          })
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
            id: createTransactionId[createTransactionId.length - 1],
            data: { status: 200, data: transaction }
          })
          createTransactionId.length = 0
        } else {
          port.postMessage({
            type: MESSAGES.SIGN_TRANSACTION_SUCCESS,
          })
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.CREATE_TRANSACTION_ERROR,
            id: createTransactionId[createTransactionId.length - 1],
            data: { message: 'Transaction rejected.' }
          })
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
            id: createTransactionId[createTransactionId.length - 1],
            data: { status: 403, data: 'Transaction rejected.' }
          })
          createTransactionId.length = 0
        }
        break
      }
      case MESSAGES.GET_WALLET: {
        port.postMessage({
          type: MESSAGES.GET_WALLET_SUCCESS,
          data: { key: koi['wallet'] }
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
