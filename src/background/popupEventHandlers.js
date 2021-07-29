import { isArray, isString, isEmpty } from 'lodash'
import Arweave from 'arweave'
import passworder from 'browser-passworder'

import storage from 'storage'
import { Account } from 'account'
import { Arweave as ArweaveWallet } from 'account/Arweave'
import { Ethereum as EthereumWallet } from 'account/Ethereum'
import { TYPE } from 'account/accountConstants'

import { backgroundAccount } from 'account'

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
  try {
    const accounts = await backgroundAccount.getAllAccounts()
    await Promise.all(accounts.map(async account => {
      let { balance, koiBalance } = await account.method.getBalances()
      const address = await account.get.address()
      // reduce balances by pending transaction expenses
      const pendingTransactions = await account.get.pendingTransactions() || []
      console.log('pendingTransactions:', pendingTransactions)
      pendingTransactions.forEach((transaction) => {
        switch (transaction.activityName) {
          case 'Sent KOII':
            koiBalance -= transaction.expense
            break
          case 'Sent AR':
            balance -= transaction.expense
            break
          case 'Sent ETH':
            balance -= transaction.expense
        }
      })
      console.log('UPDATE BALANCES FOR', address)
      console.log('koiBalance:', koiBalance,'; balance:', balance)
      await account.set.balance(balance)
      await account.set.koiBalance(koiBalance)
    }))

    if (port) {
      try {
        port.postMessage({
          type: MESSAGES.GET_BALANCES_SUCCESS,
        })
      } catch (error) {

      }
    }
  } catch (error) {
    console.error(error)
  }
}

export default async (koi, port, message, ports, resolveId, eth) => {
  try {
    switch (message.type) {
      case MESSAGES.IMPORT_WALLET: {
        try {
          let { key, password, type } = message.data
          let account
          let address
          // Create new account
          switch(type) {
            case TYPE.ARWEAVE:
              address = await ArweaveWallet.utils.loadWallet(koi, key)
              break
            case TYPE.ETHEREUM:
              address = await EthereumWallet.utils.loadWallet(eth, key)
          }

          await backgroundAccount.createAccount(address, key, password, type)
          account = await backgroundAccount.getAccount({ address, key })

          // Set seedPhrase if the key is seed phrase
          if (isString(key)) {
            const encryptedPhrase = await passworder.encrypt(password, key)
            account.set.seedPhrase(encryptedPhrase)
          }

          const totalAccounts = await backgroundAccount.count()
          account.set.accountName(`Account#${totalAccounts}`)

          port.postMessage({
            type: MESSAGES.IMPORT_WALLET,
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
          const { address } = message.data
          
          await backgroundAccount.removeAccount(address)

          port.postMessage({
            type: MESSAGES.REMOVE_WALLET,
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

          // load all accounts
          const accounts = await Account.getAll()
          await Promise.all(accounts.map(async account => {
            let contentList = await account.method.loadMyContent()

            if (isArray(contentList)) {
              contentList = contentList.filter(content => !!content.name) // remove failed loaded nfts
              console.log('CONTENT LIST: ', contentList)
              await account.set.assets(contentList)
            }
          }))

          port.postMessage({
            type: MESSAGES.LOAD_CONTENT,
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
          const { cursor, address } = message.data
          const type = await Account.getTypeOfWallet(address)
          const account = await Account.get({ address }, type)
          const { activitiesList, nextOwnedCursor, nextRecipientCursor } = await account.method.loadMyActivities(cursor)
          console.log(`Activities list of ${address}:`, activitiesList)
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
          const { qty, target, token, from } = message.data
          const { address, key } = from
          const type = await Account.getTypeOfWallet(address)
          const _account = await Account.get({ address, key }, type)

          console.log('QTY ', qty, 'TARGET ', target, 'TOKEN ', token)
          const txId = await _account.method.transfer(token, target, qty)
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
          const { password, address } = message.data
          let key
          const type = await Account.getTypeOfWallet(address)
          const _account = await Account.get({ address }, type)
          const encryptedKey = await _account.get.encryptedKey()
          console.log('encryptedKey: ', encryptedKey)
          try {
            key = await passworder.decrypt(password, encryptedKey)
            console.log('key: ', key)
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_KEY_FILE,
              error: err.message
            })  
          }
          port.postMessage({
            type: MESSAGES.GET_KEY_FILE,
            data: { key, type }
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
          type: MESSAGES.GET_WALLET,
          data: { key: koi['wallet'] }
        })
        break
      }

      case MESSAGES.UPLOAD_NFT: {
        try {
          const { content, tags, fileType } = message.data
          const result = await exportNFTNew(koi, arweave, content, tags, fileType)
          port.postMessage({
            type: MESSAGES.UPLOAD_NFT,
            data: result
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.UPLOAD_NFT,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
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
