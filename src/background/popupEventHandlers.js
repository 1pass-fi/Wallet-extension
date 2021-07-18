import passworder from 'browser-passworder'
import { isArray, isString, isEmpty } from 'lodash'
import Arweave from 'arweave'
import storage from 'storage'

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
  signTransaction,
  getBalances,
  exportNFTNew,
  createNewKid,
  updateKid
} from 'utils'

export const loadBalances = async (koi, port) => {
  const koiBalance = await storage.generic.get.koiBalance()
  const arBalance = await storage.arweaveWallet.get.balance()
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
          
          // save wallet for new storage object
          await storage.arweaveWallet.method.saveWallet(password, koi)

          await saveWalletToChrome(koi, password)

          // key is seedphrase
          if (isString(key)) {
            const encryptedPhrase = await passworder.encrypt(password, key)
            await setChromeStorage({ 'koiPhrase': encryptedPhrase })
            // save seed phrase for new storage object
            await storage.arweaveWallet.set.seedPhrase(encryptedPhrase)
          }

          await removeChromeStorage(STORAGE.CONTENT_LIST)
          await removeChromeStorage(STORAGE.ACTIVITIES_LIST)

          // remove from new storage object
          await storage.arweaveWallet.remove.activities()
          await storage.arweaveWallet.remove.assets()
          await storage.generic.remove.connectedSites()
          

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
          await storage.arweaveWallet.remove.address()
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
            walletKey = await storage.arweaveWallet.method.decryptWalletKey(password)
          } catch (err) {
            port.postMessage({
              type: MESSAGES.UNLOCK_WALLET,
              error: `${err.message}`
            })  
          }

          const koiData = await utils.loadWallet(koi, walletKey, LOAD_KOI_BY.KEY)
          
          // set address to storage -> unlock
          await storage.arweaveWallet.set.address(koi.address)

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
            await storage.arweaveWallet.set.assets(contentList)
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
          await storage.generic.method.addSite(origin)
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

      case MESSAGES.CREATE_COLLECTION: {
        try {
          const { nftIds, collectionInfo } = message.data
          const collectionId = await koi.createCollection(collectionInfo)
          console.log('Collection ID: ', collectionId)
          const txId = await koi.updateCollection(nftIds, collectionId)
          console.log('Transaction ID: ', txId)
          port.postMessage({
            type: MESSAGES.CREATE_COLLECTION,
            data: txId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.CREATE_COLLECTION,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }

      case MESSAGES.CREATE_KID: {
        try {
          const { kidInfo, fileType } = message.data
          const txId = await createNewKid(koi, kidInfo, fileType)

          port.postMessage({
            type: MESSAGES.CREATE_KID,
            data: txId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.CREATE_KID,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }

      case MESSAGES.UPDATE_KID: {
        try {
          const { kidInfo, contractId } = message.data
          console.log('UPDATE KID: ', kidInfo, '; contractId: ', contractId)
          const txId = await updateKid(koi, kidInfo, contractId)
          port.postMessage({
            type: MESSAGES.UPDATE_KID,
            data: txId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.UPDATE_KID,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
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
