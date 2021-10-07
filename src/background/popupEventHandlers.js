import { isArray, isString, isEmpty, find } from 'lodash'
import Arweave from 'arweave'
import passworder from 'browser-passworder'
import moment from 'moment'
import axios from 'axios'
import differenceBy from 'lodash/differenceBy'

import storage from 'services/storage'
import { ArweaveAccount, EthereumAccount } from 'services/account/Account'
import { TYPE } from 'constants/accountConstants'

import { getImageDataForNFT, getProviderUrlFromName } from 'utils'

import { backgroundAccount } from 'services/account'

import { MESSAGES, PORTS, STORAGE, ERROR_MESSAGE, PATH, FRIEND_REFERRAL_ENDPOINTS } from 'constants/koiConstants'

import { popupPorts } from '.'

import showNotification from 'utils/notifications'

const generatedKey = { key: null, mnemonic: null, type: null, address: null }

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

const sendMessageToAllPorts = (message) => {
  popupPorts.forEach((port) => port.postMessage(message))
}

const reloadGallery = () => {
  const reloadMessage = { type: MESSAGES.RELOAD_GALLERY }
  sendMessageToAllPorts(reloadMessage)
}

export const updatePendingTransactions = async () => {
  const allAccounts = await backgroundAccount.getAllAccounts()
  allAccounts.forEach(async account => {
    let pendingTransactions = await account.get.pendingTransactions()
    pendingTransactions = await Promise.all(pendingTransactions.map(async transaction => {
      const confirmed = await account.method.transactionConfirmedStatus(transaction.id)

      if (confirmed) {
        console.log(`Transaction confirmed`, transaction)
        showNotification({
          title: `Transaction confirmed`,
          message: `Your transaction ${transaction.activityName} has been confirmed`
        })
        return
      }
      return transaction
    }))

    pendingTransactions = pendingTransactions.filter(transaction => !!transaction)
    await account.set.pendingTransactions(pendingTransactions)
  })
}


/* 
  Reload balances every 5 minutes
  Subtract balances by pending transaction expenses
*/
export const loadBalances = async () => {
  try {
    const accounts = await backgroundAccount.getAllAccounts()
    await Promise.all(accounts.map(async account => {
      let { balance, koiBalance } = await account.method.getBalances()

      await account.set.balance(balance)
      await account.set.koiBalance(koiBalance)
    }))

    const message = { type: MESSAGES.GET_BALANCES_SUCCESS }
    sendMessageToAllPorts(message)
  } catch (error) {
    console.error(error)
  }
}

/* 
  Load state for pending transactions every 30 seconds
*/
export const loadTransactionState = async () => {
  try {
    const accounts = await backgroundAccount.getAllAccounts()
    await Promise.all(accounts.map(async account => {
      const pendingTransactions = await account.get.pendingTransactions() || []

      pendingTransactions.forEach(async () => {
        const confirmed = await arweaveConfirmStatus(transaction.id)

        if (confirmed) {
          chromeNotification({
            title: `Transaction confirmed`,
            message: `Your transaction [${transaction.activityName}] has been confirmed.`
          })
          let newTransactions = [...pendingTransactions]
          newTransactions = newTransactions.filter(aTransaction => aTransaction.id !== transaction.id)
          await account.set.pendingTransactions(newTransactions)

          if (transaction.activityName.includes('Minted')) {
            let activityNotifications = await storage.generic.get.activityNotifications() || []
            const title = transaction.activityName.slice(transaction.activityName.indexOf(`"`))
            const newNotification = {
              id: transaction.id,
              title,
              date: transaction.date
            }

            activityNotifications = [...activityNotifications, newNotification]
            await storage.generic.set.activityNotifications(activityNotifications)
          }
        }
      })
    }))
  } catch (error) {
    console.error(error)
  }
}


/**
 * 
 * @param {Array} contents Up to date NFTs
 * @param {Account} account NFTs owner
 */
export const cacheNFTs = async (contents, account) => {
  try {

    if (isArray(contents)) {
      const contentList = contents.filter(content => !!content.name) // remove failed loaded nfts
      console.log('Cache NFTs: ', contentList.length)
      await account.set.assets(contentList)

      // filter pending assets
      let pendingAssets = await account.get.pendingAssets() || []
      pendingAssets = pendingAssets.filter(asset => {
        return contents.every(content => content.txId !== asset.txId)
      })
      await account.set.pendingAssets(pendingAssets)
    }
  } catch (error) {
    console.error(error)
  }
}

/*
  Load new NFT contents
    Step 1: get all NFTs of account in current Chrome storage
    Step 2: detect no-need-update NFTs from above list.
    Step 3: append up-to-date NFTs and new NFTs
*/
export const saveNewNFTsToStorage = async (newContents, account) => {
  try {
    if (isArray(newContents)) {
      let newNFTContents = await account.method.getNftData(newContents, true)
      newNFTContents = newNFTContents.filter(content => !!content.name) // remove failed loaded nfts
      let allNFTs = await account.get.assets()

      const oldNFTs = differenceBy(allNFTs, newNFTContents, 'txId')

      console.log('Stored NFTs: ', newNFTContents.length)
      allNFTs = [...oldNFTs, ...newNFTContents]
      account.set.assets(allNFTs)
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
          let { key, password, type, provider } = message.data
          let account
          let address

          let seedPhrase
          if (isString(key)) seedPhrase = key
          /* 
            Check for having imported account.
          */
          const count = await backgroundAccount.count()
          const activatedAccountAddress = await storage.setting.get.activatedAccountAddress()
          const encryptedKey = await backgroundAccount.getEncryptedKey(activatedAccountAddress)

          if (count) {
            // Check input password
            try {
              await passworder.decrypt(password, encryptedKey)
            } catch (err) {
              port.postMessage({
                type: MESSAGES.IMPORT_WALLET,
                error: err.message,
                id: messageId
              })
              return
            }
          }

          // Create new account
          switch (type) {
            case TYPE.ARWEAVE:
              address = await ArweaveAccount.utils.loadWallet(koi, key)
              break
            case TYPE.ETHEREUM:
              address = await EthereumAccount.utils.loadWallet(eth, key)
          }

          if (isString(key) && type == TYPE.ARWEAVE) key = koi.wallet
          if (type == TYPE.ETHEREUM) key = eth.key
          await backgroundAccount.createAccount(address, key, password, type)
          account = await backgroundAccount.getAccount({ address, key })

          // Set seedPhrase if the key is seed phrase for arweave
          if (seedPhrase) {
            const encryptedPhrase = await passworder.encrypt(password, seedPhrase)
            account.set.seedPhrase(encryptedPhrase)
          }

          // Set seedPhrase ethereum

          // Get total account to get a appropriate accountName
          // Set account provider
          const totalAccounts = await backgroundAccount.count()
          await account.set.accountName(`Account#${totalAccounts}`)
          const providerUrl = getProviderUrlFromName(provider)
          console.log('PROVIDER URL', providerUrl)
          if (provider) await account.set.provider(providerUrl)

          // If total account = 1, set this accountAddress to activatedAccountAddress
          if (totalAccounts == 1) {
            await storage.setting.set.activatedAccountAddress(await account.get.address())
          }

          loadBalances()
          port.postMessage({
            type: MESSAGES.IMPORT_WALLET,
            data: address,
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

          reloadGallery()
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
          await backgroundAccount.removeConnectedSite()
          port.postMessage({
            type: MESSAGES.LOCK_WALLET,
            id: messageId
          })
        } catch (err) {
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
          const { walletType } = message.data
          let walletObj
          let seedPhrase
          let key
          let address
          switch (walletType) {
            case TYPE.ARWEAVE:
              walletObj = new Web()
              seedPhrase = await ArweaveAccount.utils.generateWallet(walletObj)
              address = walletObj.address
              break
            case TYPE.ETHEREUM:
              walletObj = new Ethereum()
              seedPhrase = await EthereumAccount.utils.generateWallet(walletObj)
              key = { key: walletObj.key } // key of eth wallet will be String
              address = walletObj.address
              walletObj.wallet = key
          }

          generatedKey.key = walletObj.wallet
          generatedKey.mnemonic = seedPhrase
          generatedKey.type = walletType
          generatedKey.address = address

          port.postMessage({
            type: MESSAGES.GENERATE_WALLET,
            data: seedPhrase.split(' '),
            id: messageId
          })
        } catch (err) {
          generatedKey.key = null
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
            Load assets of all accounts then 
          */
          let allAccounts
          const { address } = message.data
          if (address) {
            const credentials = await backgroundAccount.getCredentialByAddress(address)
            const account = await backgroundAccount.getAccount(credentials)
            allAccounts = [account]
          } else {
            allAccounts = await backgroundAccount.getAllAccounts()
          }

          await Promise.all(allAccounts.map(async account => {
            const { contents, newContents } = await account.method.loadMyContent()
            await cacheNFTs(contents, account)
            port.postMessage({
              type: MESSAGES.LOAD_CONTENT,
              id: messageId
            })
            await saveNewNFTsToStorage(newContents, account)

          }))
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
          console.log('credentials', credentials)
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
        } catch (err) {
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
        const { origin, confirm, address } = message.data
        const { permissionId } = resolveId

        if (confirm) {
          const siteAddressDict = await storage.setting.get.siteAddressDictionary() || {}
          siteAddressDict[origin] = address
          await storage.setting.set.siteAddressDictionary(siteAddressDict)

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
        let { tx, confirm, origin } = message.data
        let transaction = null

        const siteAddressDict = await storage.setting.get.siteAddressDictionary()
        const address = siteAddressDict[origin]
        if (!address) confirm = false

        const credentials = await backgroundAccount.getCredentialByAddress(address)
        const account = await backgroundAccount.getAccount(credentials)

        if (confirm) {
          chrome.browserAction.setBadgeText({ text: '' })
          const transactionData = await storage.generic.get.transactionData()
          tx.data = transactionData
          transaction = await account.method.signTransaction(tx)
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

          // save pending nft to storage
          let { file } = await getImageDataForNFT(fileType)

          const url = URL.createObjectURL(file)

          const base64String = Buffer.from((await axios.get(url, { responseType: 'arraybuffer' })).data, 'binary').toString('base64')
          let imageUrl = `data:image/jpeg;base64,${base64String}`
          if (fileType.includes('video')) imageUrl = `data:video/mp4;base64,${base64String}`

          let d = new Date()
          let createdAt = Math.floor(d.getTime() / 1000).toString()

          const pendingNFT = {
            name: content.title,
            isKoiWallet: true,
            earnedKoi: 0,
            txId: result.txId,
            imageUrl,
            galleryUrl: `${PATH.GALLERY}#/details/${result.txId}`,
            koiRockUrl: `${PATH.KOI_ROCK}/${result.txId}`,
            isRegistered: true,
            contentType: fileType,
            totalViews: 0,
            createdAt,
            description: content.description,
            pending: true,
            type: TYPE.ARWEAVE
          }

          const allPendingAssets = await account.get.pendingAssets() || []
          allPendingAssets.push(pendingNFT)
          await account.set.pendingAssets(allPendingAssets)

          port.postMessage({
            type: MESSAGES.UPLOAD_NFT,
            data: result,
            id: messageId
          })
          port.postMessage({
            type: MESSAGES.UPLOAD_NFT_SUCCESS,
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
          
          reloadGallery()
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

      case MESSAGES.SAVE_WALLET_GALLERY: {
        try {
          let { password, provider } = message.data
          // Get key and seedphrase from koitool.
          const { key, mnemonic: seedPhrase, type } = generatedKey
          if (type == TYPE.ARWEAVE) provider = null
          /* 
            Check for having imported account.
          */
          const count = await backgroundAccount.count()
          const activatedAccountAddress = await storage.setting.get.activatedAccountAddress()
          const encryptedKey = await backgroundAccount.getEncryptedKey(activatedAccountAddress)

          if (count) {
            // Check input password
            try {
              await passworder.decrypt(password, encryptedKey)
            } catch (err) {
              port.postMessage({
                type: MESSAGES.SAVE_WALLET_GALLERY,
                error: err.message,
                id: messageId
              })
              return
            }
          }

          // get address from generatedKey object
          let addressFromKey = generatedKey.address

          const encryptedSeedPhrase = await passworder.encrypt(password, seedPhrase)

          // create new Account on background.
          await backgroundAccount.createAccount(addressFromKey, key, password, type)

          // get account object to set encrypted seedphrase
          const credentials = await backgroundAccount.getCredentialByAddress(addressFromKey)
          const account = await backgroundAccount.getAccount(credentials)
          account.set.seedPhrase(encryptedSeedPhrase)

          // Get total account to get a appropriate account name.
          const totalAccounts = await backgroundAccount.count()
          await account.set.accountName(`Account#${totalAccounts}`)
          console.log('totalAccounts', totalAccounts)
          // Set network provider
          const networkProvider = getProviderUrlFromName(provider)
          if (networkProvider) await account.set.provider(networkProvider)

          // If total account = 1, set this account to activatedAccountAddress.
          if (totalAccounts == 1) {
            await storage.setting.set.activatedAccountAddress(await account.get.address())
          }

          loadBalances()
          port.postMessage({
            type: MESSAGES.SAVE_WALLET_GALLERY,
            data: addressFromKey,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.SAVE_WALLET_GALLERY,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.SET_DEFAULT_ACCOUNT: {
        try {
          const { address } = message.data

          await storage.setting.set.activatedAccountAddress(address)
          port.postMessage({
            type: MESSAGES.SET_DEFAULT_ACCOUNT,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.SET_DEFAULT_ACCOUNT,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.FRIEND_REFERRAL: {
        try {
          const { endpoints, payload } = message.data
          const defaultAddress = await storage.setting.get.activatedAccountAddress()
          const credentials = await backgroundAccount.getCredentialByAddress(defaultAddress)
          const account = await backgroundAccount.getAccount(credentials)
          let result
          switch (endpoints) {
            case FRIEND_REFERRAL_ENDPOINTS.GET_AFFILIATE_CODE: {
              result = await account.method.getAffiliateCode()
              break
            }

            case FRIEND_REFERRAL_ENDPOINTS.GET_TOTAL_REWARD: {
              result = await account.method.getTotalRewardKoi()
              break
            }

            case FRIEND_REFERRAL_ENDPOINTS.CHECK_AFFILIATE_INVITE_SPENT: {
              result = await account.method.checkAffiliateInviteSpent()
              break
            }

            case FRIEND_REFERRAL_ENDPOINTS.CLAIM_REWARD: {
              result = await account.method.claimReward()
              break
            }
          }

          port.postMessage({
            type: MESSAGES.FRIEND_REFERRAL,
            data: result,
            id: messageId
          })

        } catch (err) {
          port.postMessage({
            type: MESSAGES.FRIEND_REFERRAL,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.TRANSFER_NFT: {
        try {
          const { senderAddress, targetAddress, txId, numOfTransfers } = message.data

          // get credentials of sender address
          const credentials = await backgroundAccount.getCredentialByAddress(senderAddress)
          const account = await backgroundAccount.getAccount(credentials)
          const typeOfWallet = await backgroundAccount.getType(targetAddress)
          const result = await account.method.nftBridge(txId, targetAddress, typeOfWallet)

          if (result) {
            port.postMessage({
              type: MESSAGES.TRANSFER_NFT,
              data: result,
              id: messageId
            })
          } else {
            port.postMessage({
              type: MESSAGES.TRANSFER_NFT,
              error: 'Transfer NFT failed',
              id: messageId
            })

          }
        } catch (err) {
          port.postMessage({
            type: MESSAGES.TRANSFER_NFT,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId
          })
        }
        break
      }

      case MESSAGES.REAL_TRANSFER_NFT: {
        try {
          const { nftId, senderAddress, recipientAddress } = message.data

          const credentials = await backgroundAccount.getCredentialByAddress(senderAddress)
          const account = await backgroundAccount.getAccount(credentials)

          const txId = await account.method.transferNFT(nftId, recipientAddress)

          port.postMessage({
            type: MESSAGES.REAL_TRANSFER_NFT,
            data: txId,
            id: messageId
          })
        } catch (err) {
          port.postMessage({
            type: MESSAGES.REAL_TRANSFER_NFT,
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
