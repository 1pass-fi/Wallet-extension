import passworder from 'browser-passworder'
import { isArray, isString, isEmpty } from 'lodash'
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
})

import { MESSAGES, LOAD_KOI_BY, PORTS, STORAGE, ALL_NFT_LOADED, ERROR_MESSAGE } from 'koiConstants'
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
  getBalances,
  exportNFTNew
} from 'utils'

export const loadBalances = async (koi, port) => {
  const storage = await getChromeStorage([STORAGE.KOI_BALANCE, STORAGE.AR_BALANCE])
  const koiBalance = storage[STORAGE.KOI_BALANCE]
  const arBalance = storage[STORAGE.AR_BALANCE]
  if (koiBalance !== null && arBalance !== null) {
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
        try {
          const { key, password } = message.data
          const koiData = await utils.loadWallet(koi, key, LOAD_KOI_BY.KEY)
          await saveWalletToChrome(koi, password)

          if (isString(key)) {
            const encryptedPhrase = await passworder.encrypt(password, key)
            await setChromeStorage({ 'koiPhrase': encryptedPhrase })
          }

          await removeChromeStorage(STORAGE.SITE_PERMISSION)
          await removeChromeStorage(STORAGE.CONTENT_LIST)
          await removeChromeStorage(STORAGE.ACTIVITIES_LIST)
          port.postMessage({
            type: MESSAGES.IMPORT_WALLET,
            data: { koiData }
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.IMPORT_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }

        break
      }
      case MESSAGES.GET_BALANCES: {
        loadBalances(koi, port)
        break
      }

      case MESSAGES.REMOVE_WALLET: {
        try {
          const koiData = {
            arBalance: null,
            koiBalance: null,
            address: null
          }
          await clearChromeStorage()
          koi.wallet = null
          koi.address = null
          port.postMessage({
            type: MESSAGES.REMOVE_WALLET,
            data: { koiData }
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.REMOVE_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }
      case MESSAGES.LOCK_WALLET: {
        try {
          await removeChromeStorage(STORAGE.KOI_ADDRESS)
          koi.address = null
          koi.wallet = null
  
          const koiData = {
            arBalance: null,
            koiBalance: null,
            address: null
          }
          port.postMessage({
            type: MESSAGES.LOCK_WALLET,
            data: { koiData }
          })
        } catch(err) {
          port.postMessage({
            type: MESSAGES.LOCK_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`           
          })        
        }
        break
      }
      case MESSAGES.UNLOCK_WALLET: {
        try {
          const { password } = message.data
          let walletKey

          // throw error if password is incorrect
          try {
            walletKey = await decryptWalletKeyFromChrome(password)
          } catch (err) {
            port.postMessage({
              type: MESSAGES.UNLOCK_WALLET,
              error: `${err.message}`
            })  
          }

          const koiData = await utils.loadWallet(koi, walletKey, LOAD_KOI_BY.KEY)
          await setChromeStorage({ [STORAGE.KOI_ADDRESS]: koi.address })
          port.postMessage({
            type: MESSAGES.UNLOCK_WALLET,
            data: { koiData }
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.UNLOCK_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
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
        try {
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
  
          port.postMessage({
            type: MESSAGES.SAVE_WALLET,
            data: { koiData }
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.SAVE_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }
      case MESSAGES.LOAD_CONTENT: {
        try {
          /*
            loadMyContent() will return an array of nfts.
            loadMyContent() will return 'ALL_NFT_LOADED' if there was no new nft.
          */
          let contentList = await loadMyContent(koi)

          if (isArray(contentList)) {
            contentList = contentList.filter(content => !!content.name) // remove failed loaded nfts
            console.log('CONTENT LIST: ', contentList)
            setChromeStorage({ contentList })
          }

          port.postMessage({
            type: MESSAGES.LOAD_CONTENT,
            data: { contentList } // array or 'ALL_NFT_LOADED'
          })

        } catch (err) {
          port.postMessage({
            type: MESSAGES.LOAD_CONTENT,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }
      case MESSAGES.LOAD_ACTIVITIES: {
        try {
          const { cursor } = message.data
          const { activitiesList, nextOwnedCursor, nextRecipientCursor } = await loadMyActivities(koi, cursor)
          console.log('ACTIVITIES LIST', activitiesList)
          setChromeStorage({ activitiesList })
          port.postMessage({
            type: MESSAGES.LOAD_ACTIVITIES,
            data: { activitiesList, nextOwnedCursor, nextRecipientCursor }
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.LOAD_ACTIVITIES,
            error: `BACKGROUND ERROR: ${err.message}`
          })          
        }
        break
      }
      case MESSAGES.MAKE_TRANSFER: {
        try {
          const { qty, target, currency } = message.data
          console.log('QTY ', qty, 'TARGET ', target, 'CURRENCY ', currency)
          const txId = await transfer(koi, qty, target, currency)
          port.postMessage({
            type: MESSAGES.MAKE_TRANSFER,
            data: { txId }
          })
        } catch(err) {
          if (err.message == ERROR_MESSAGE.NOT_ENOUGH_KOI || err.message == ERROR_MESSAGE.NOT_ENOUGH_AR) {
            port.postMessage({
              type: MESSAGES.MAKE_TRANSFER,
              error: err.message
            })          
          } else {
            port.postMessage({
              type: MESSAGES.MAKE_TRANSFER,
              error: `BACKGROUND ERROR: ${err.message}`
            })          
          }
        }
        break
      }
      case MESSAGES.GET_KEY_FILE: {
        try {
          const { password } = message.data
          let key
          try {
            key = await decryptWalletKeyFromChrome(password)
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_KEY_FILE,
              error: err.message
            })  
          }
          port.postMessage({
            type: MESSAGES.GET_KEY_FILE,
            data: { key }
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.GET_KEY_FILE,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }
      case MESSAGES.CONNECT: {
        const { origin, confirm } = message.data
        const { permissionId } = resolveId
        if (confirm) {
          await saveOriginToChrome(origin)
          chrome.browserAction.setBadgeText({ text: '' })
          ports[PORTS.CONTENT_SCRIPT].postMessage({
            type: MESSAGES.KOI_CONNECT_SUCCESS,
            data: { status: 200, data: 'Connected.' },
            id: permissionId[permissionId.length - 1],
          })
        } else {
          chrome.browserAction.setBadgeText({ text: '' })
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
          chrome.browserAction.setBadgeText({ text: '' })
          const transactionData = (await getChromeStorage('transactionData'))['transactionData'] || []
          tx.data = transactionData
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
          chrome.browserAction.setBadgeText({ text: '' })
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

      case MESSAGES.UPLOAD_NFT: {
        const { content, tags, fileType } = message.data
        const result = await exportNFTNew(koi, arweave, content, tags, fileType)
        port.postMessage({
          type: MESSAGES.UPLOAD_NFT,
          data: result
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
