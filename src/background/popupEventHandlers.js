import { isArray, isString, isEmpty } from 'lodash'
import Arweave from 'arweave'
import passworder from 'browser-passworder'
import moment from 'moment'

import storage from 'storage'
import { Account } from 'account'
import { Arweave as ArweaveWallet } from 'account/Arweave'
import { Ethereum as EthereumWallet } from 'account/Ethereum'
import { TYPE } from 'account/accountConstants'

import { backgroundAccount } from 'account'

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

import arweaveConfirmStatus from 'utils/arweaveConfirmStatus'
import chromeNotification from 'utils/notifications'

import { Web } from '@_koi/sdk/web'
import { Ethereum } from './eth'

const arweave = Arweave.init({
  host: 'arweave.net',
  protocol: 'https',
  port: 443,
})

export const loadBalances = async (koi, port) => {
  try {
    const accounts = await backgroundAccount.getAllAccounts()
    await Promise.all(accounts.map(async account => {
      let { balance, koiBalance } = await account.method.getBalances()
      const address = await account.get.address()

      const pendingTransactions = await account.get.pendingTransactions() || []
      const pendingConfirmationTransactions = await account.get.pendingConfirmationTransaction() || []
      console.log('pendingTransactions:', pendingTransactions)
      console.log('pendingConfirmationTransactions:', pendingConfirmationTransactions)
      if (!isEmpty(pendingTransactions)) {
        // reduce balances by pending transaction expenses
        pendingTransactions.forEach(async (transaction) => {
          // reduce balances
          
          // check for confirmed state
          const confirmed = await arweaveConfirmStatus(transaction.id)
          if (confirmed) {
            chromeNotification({
              title: `Transaction ${transaction.activityName} is now in pending confirmation`,
              message: `You can check on the state of your transaction on viewblock.`
            })
            let newTransactions = [...pendingTransactions]
            console.log(newTransactions)
            console.log(transaction)            
            newTransactions = newTransactions.filter(aTransaction => aTransaction.id !== transaction.id)
            await account.set.pendingTransactions(newTransactions)

            await account.set.addPendingConfirmationTransaction(transaction)
          } else {
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
          }
        })
      }

      if (!isEmpty(pendingConfirmationTransactions)) {
        // reduce balances by pending transaction expenses
        pendingConfirmationTransactions.forEach(async (transaction) => {
          // reduce balances
          
          // check for confirmed state
          const { activitiesList: mostRecentActivities } = await account.method.loadMyActivities({ ownedCursor: null, recipientCursot: null })
          console.log(mostRecentActivities)
          const confirmed = !(mostRecentActivities.every(aTransaction => aTransaction.id !== transaction.id))
          if (confirmed) {
            chromeNotification({
              title: `Transaction ${transaction.activityName} has been confirmed`,
              message: `You can check on the state of your transaction on viewblock.`
            })
            let newTransactions = [...pendingConfirmationTransactions]
            console.log(newTransactions)
            console.log(transaction)            
            newTransactions = newTransactions.filter(aTransaction => aTransaction.id !== transaction.id)
            await account.set.pendingConfirmationTransaction(newTransactions)
          } else {
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
          }
        })
      }


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
    const messageId = message.id
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
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.IMPORT_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
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
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.REMOVE_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }
      case MESSAGES.LOCK_WALLET: {
        try {
          await backgroundAccount.removeAllImported()
          port.postMessage({
            type: MESSAGES.LOCK_WALLET,
            id: messageId
          })
        } catch(err) {
          port.postMessage({
            type: MESSAGES.LOCK_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId      
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
            await backgroundAccount.unlockImportedAccount(password)
          } catch (err) {
            port.postMessage({
              type: MESSAGES.UNLOCK_WALLET,
              error: `${err.message}`,
              id: messageId
            })  
          }

          port.postMessage({
            type: MESSAGES.UNLOCK_WALLET,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.UNLOCK_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }
      case MESSAGES.GENERATE_WALLET: {
        try {
          const { walletType, password } = message.data
          let walletObj
          let seedPhrase
          let key
          switch(walletType) {
            case TYPE.ARWEAVE:
              walletObj = new Web()
              seedPhrase = await ArweaveWallet.utils.generateWallet(walletObj)
              key = walletObj.wallet
              break
            case TYPE.ETHEREUM:
              walletObj = new Ethereum()
              seedPhrase = await EthereumWallet.utils.generateWallet(walletObj)
              key = {key: walletObj.key} // key of eth wallet will be String
          }
          const encryptedKey = await passworder.encrypt(password, key)
          await setChromeStorage({ 'createdWalletAddress': walletObj.address, 'createdWalletKey': encryptedKey })

          port.postMessage({
            type: MESSAGES.GENERATE_WALLET,
            data: { seedPhrase },
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.GENERATE_WALLET,
            id: messageId,
            error: `BACKGROUND ERROR: ${err.message}`
          })
        }
        break
      }
      case MESSAGES.SAVE_WALLET: {
        try {
          const { password, walletType } = message.data
  
          const createdWalletAddress = (await getChromeStorage('createdWalletAddress'))['createdWalletAddress']
          const createdWalletKey = (await getChromeStorage('createdWalletKey'))['createdWalletKey']

          const decryptedWalletKey = await passworder.decrypt(password, createdWalletKey)


          if (!(createdWalletAddress && decryptedWalletKey)) throw new Error(ERROR_MESSAGE.CREATE_WALLET_FAILED)

          await backgroundAccount.createAccount(createdWalletAddress, decryptedWalletKey, password, walletType)
          const account = await backgroundAccount.getAccount({ address: createdWalletAddress, key: decryptedWalletKey })
          const totalAccounts = await backgroundAccount.count()
          account.set.accountName(`Account#${totalAccounts}`)
    
          port.postMessage({
            type: MESSAGES.SAVE_WALLET,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.SAVE_WALLET,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
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
          const allAccounts = await backgroundAccount.getAllAccounts()

          await Promise.all(allAccounts.map(async account => {
            let contentList = await account.method.loadMyContent()
            if (isArray(contentList)) {
              contentList = contentList.filter(content => !!content.name) // remove failed loaded nfts
              console.log('CONTENT LIST: ', contentList)
              await account.set.assets(contentList)
            }
          }))

          port.postMessage({
            type: MESSAGES.LOAD_CONTENT,
            id: messageId
          })

        } catch (err) {
          port.postMessage({
            type: MESSAGES.LOAD_CONTENT,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }
      case MESSAGES.LOAD_ACTIVITIES: {
        try {
          const { cursor, address } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)

          const { activitiesList, nextOwnedCursor, nextRecipientCursor } = await account.method.loadMyActivities(cursor)
          
          // filter pending transactions
          let pendingTransactions = await account.get.pendingTransactions() || []
          pendingTransactions = pendingTransactions.filter(tx => {
            return activitiesList.every(activity => activity.id !== tx.id)
          })
          await account.set.pendingTransactions(pendingTransactions)

          console.log(`Activities list of ${address}:`, activitiesList)
          port.postMessage({
            type: MESSAGES.LOAD_ACTIVITIES,
            data: { activitiesList, nextOwnedCursor, nextRecipientCursor },
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.LOAD_ACTIVITIES,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })          
        }
        break
      }
      case MESSAGES.MAKE_TRANSFER: {
        try {
          const { qty, target, token, address } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)
          const accountName = await account.get.accountName()

          console.log('QTY ', qty, 'TARGET ', target, 'TOKEN ', token)
          const txId = await account.method.transfer(token, target, qty)

          // add new pending transaction
          const pendingTransactions = await account.get.pendingTransactions() || []
          const newTransaction = {
            id: txId,
            activityName: (token === 'KOI' ? 'Sent KOII' : `Sent ${token}`),
            expense: qty,
            accountName,
            date: moment().format('MMMM DD YYYY'),
            source: target
          }
          pendingTransactions.unshift(newTransaction)
          // save pending transactions
          await account.set.pendingTransactions(pendingTransactions)

          port.postMessage({
            type: MESSAGES.MAKE_TRANSFER,
            data: { txId },
            id: messageId
          })
        } catch(err) {
          if (err.message == ERROR_MESSAGE.NOT_ENOUGH_KOI || err.message == ERROR_MESSAGE.NOT_ENOUGH_AR) {
            port.postMessage({
              type: MESSAGES.MAKE_TRANSFER,
              error: err.message,
              id: messageId
            })          
          } else {
            port.postMessage({
              type: MESSAGES.MAKE_TRANSFER,
              error: `BACKGROUND ERROR: ${err.message}`,
              id: messageId
            })          
          }
        }
        break
      }
      case MESSAGES.GET_KEY_FILE: {
        try {
          const { password, address } = message.data
          let key
          const encryptedKey = await backgroundAccount.getEncryptedKey(address)
          if (!encryptedKey) throw new Error('Unable to find keyfile.')
          try {
            key = await passworder.decrypt(password, encryptedKey)
          } catch (err) {
            port.postMessage({
              type: MESSAGES.GET_KEY_FILE,
              error: err.message,
              id: messageId
            })
          }
          port.postMessage({
            type: MESSAGES.GET_KEY_FILE,
            data: { key },
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.GET_KEY_FILE,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
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
          id: messageId
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
            id: messageId
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
            id: messageId
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
          data: { key: koi['wallet'] },
          id: messageId
        })
        break
      }

      case MESSAGES.UPLOAD_NFT: {
        try {
          const { content, tags, fileType, address, price } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)
          const accountName = await account.get.accountName()
          const { key } = credentials
          const koi = new Web()

          koi.address = address
          koi.wallet = key

          const result = await exportNFTNew(koi, arweave, content, tags, fileType)

          const newPendingTransaction = {
            id: result.txId,
            activityName: `Minted NFT "${content.title}"`,
            expense: price,
            accountName,
            date: moment().format('MMMM DD YYYY')
          }

          const pendingTransactions = await account.get.pendingTransactions() || []
          pendingTransactions.unshift(newPendingTransaction)
          await account.set.pendingTransactions(pendingTransactions)


          port.postMessage({
            type: MESSAGES.UPLOAD_NFT,
            data: result,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.UPLOAD_NFT,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.CREATE_COLLECTION: {
        try {
          const { nftIds, collectionInfo, address } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)
          const txId = await account.method.createCollection(collectionInfo, nftIds)
          
          console.log('Transaction ID: ', txId)
          port.postMessage({
            type: MESSAGES.CREATE_COLLECTION,
            data: txId,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.CREATE_COLLECTION,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
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
            data: txId,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.CREATE_KID,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
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
            data: txId,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.UPDATE_KID,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.CHANGE_ACCOUNT_NAME: {
        try {
          const { address, newName } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)

          await account.set.accountName(newName)

          port.postMessage({
            type: MESSAGES.CHANGE_ACCOUNT_NAME,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.CHANGE_ACCOUNT_NAME,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.GET_LOCK_STATE: {
        /* 
          Return true if locked.
        */
        try {
          const locked = isEmpty(backgroundAccount.importedAccount)
          port.postMessage({
            type: MESSAGES.GET_LOCK_STATE,
            data: locked,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.GET_LOCK_STATE,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.LOAD_COLLECTIONS: {
        try {
          const allAccounts = await backgroundAccount.getAllAccounts()
          await Promise.all(allAccounts.map(async account => {
            const fetchedCollections = await account.method.loadCollections()
            if (!isString(fetchedCollections)) await account.set.collections(fetchedCollections)
          }))
          port.postMessage({
            type: MESSAGES.LOAD_COLLECTIONS,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.LOAD_COLLECTIONS,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.LOAD_KID: {
        try {
          const { address } = message.data
          console.log('LOAD_KID')
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)
          
          const kidData = await account.method.loadKID()
          console.log('LOAD_KID', kidData)
          await account.set.kid(kidData)
          port.postMessage({
            type: MESSAGES.LOAD_KID,
            data: kidData,
            id: messageId
          })

        } catch (err) {
          port.postMessage({
            type: MESSAGES.LOAD_KID,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.CREATE_UPDATE_KID: {
        try {
          const { kidInfo, address, payload } = message.data
          const { syncWallet } = kidInfo
          let allAccounts
          if (syncWallet) {
            allAccounts = await backgroundAccount.getAllAccounts()
          } else {
            const credentials = await backgroundAccount.getCredentialByAddress(address)
            const account = await backgroundAccount.getAccount(credentials)
            allAccounts = [account]
          }
          await Promise.all(allAccounts.map(async account => {
            await account.method.createOrUpdateKID(kidInfo, payload)
          }))

          port.postMessage({
            type: MESSAGES.CREATE_UPDATE_KID,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.CREATE_UPDATE_KID,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
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
