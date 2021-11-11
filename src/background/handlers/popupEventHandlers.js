import { 
  isArray, 
  isString, 
  isEmpty, 
  differenceBy, 
  find
} from 'lodash'
import passworder from 'browser-passworder'
import moment from 'moment'
import axios from 'axios'
import { Web } from '@_koi/sdk/web'

// Services
import storage from 'services/storage'
import { ArweaveAccount, EthereumAccount } from 'services/account/Account'
import { backgroundAccount } from 'services/account'
import arweave from 'services/arweave'
import { Ethereum } from 'services/ethereum'

// Constants
import { TYPE } from 'constants/accountConstants'
import { 
  MESSAGES, 
  PORTS, 
  STORAGE, 
  ERROR_MESSAGE, 
  PATH, 
  FRIEND_REFERRAL_ENDPOINTS,
  PENDING_TRANSACTION_TYPE
} from 'constants/koiConstants'

import helpers from '../helpers'

// Utils
import {
  getImageDataForNFT,
  getProviderUrlFromName,
  removeChromeStorage,
  getChromeStorage,
  exportNFTNew,
  createNewKid,
  updateKid
} from 'utils'

const generatedKey = { key: null, mnemonic: null, type: null, address: null }

const reloadGallery = () => {
  const reloadMessage = { type: MESSAGES.RELOAD_GALLERY }
  helpers.sendMessageToPopupPorts(reloadMessage)
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
          /* 
            Get data from popup message
          */
          let { key: keyOrSeedphrase, password, type, provider } = message.data
          let address, walletKey, seedphrase

          let account

          /* 
            Determine if have seedphrase
          */
          if (type === TYPE.ARWEAVE) {
            if (isString(keyOrSeedphrase)) seedphrase = keyOrSeedphrase
          }
          if (type === TYPE.ETHEREUM) {
            if (isString(keyOrSeedphrase)) {
              const totalWords = keyOrSeedphrase.split(' ')
              if (totalWords === 12) seedphrase = keyOrSeedphrase
            }
          }

          /* 
            Password validation
            - If no imported account -> skip
          */
          const count = await backgroundAccount.count()
          if (count) {
            const activatedAccountAddress = await storage.setting.get.activatedAccountAddress()
            const encryptedKey = await backgroundAccount.getEncryptedKey(activatedAccountAddress)

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

          /* 
            Create new account on storage
          */
          switch(type) {
            case TYPE.ARWEAVE:
              address = await ArweaveAccount.utils.loadWallet(koi, keyOrSeedphrase)
              walletKey = koi.wallet
              break
            case TYPE.ETHEREUM:
              address = await EthereumAccount.utils.loadWallet(eth, keyOrSeedphrase)
              walletKey = eth.key
              break
          }

          // if account existed -> send error
          const accountExist = !backgroundAccount.importedAccount.every(credentials => {
            return credentials.address !== address
          })

          if (accountExist) {
            port.postMessage({
              type: MESSAGES.IMPORT_WALLET,
              error: ERROR_MESSAGE.ACCOUNT_EXIST,
              id: messageId
            })

            return
          }

          await backgroundAccount.createAccount(address, walletKey, password, type)
          
          account = await backgroundAccount.getAccount({ address, key: walletKey })

          /* 
            Set seedPhrase field if any
          */
          if (seedphrase) {
            const encryptedPhrase = await passworder.encrypt(password, seedphrase)
            await account.set.seedPhrase(encryptedPhrase)
          }

          /* 
            Set the provider if any (ethereum wallet will habe)
          */
          const providerUrl = getProviderUrlFromName(provider)
          if (provider) await account.set.provider(providerUrl)
  

          /* 
            Get a default name for this account
          */
          const totalAccounts = await backgroundAccount.count()
          await account.set.accountName(`Account#${totalAccounts}`)

          /* 
            If total account = 1, set this accountAddress to activatedAccountAddress
          */
          if (totalAccounts == 1) {
            await storage.setting.set.activatedAccountAddress(await account.get.address())
          }
         
          /* 
            Get balance for this account
          */
          helpers.loadBalances()

          helpers.loadActivities()
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
        helpers.loadBalances()
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
          helpers.loadActivities()
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
          
          helpers.loadBalances()
          helpers.loadActivities()

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
              key = walletObj.key // key of eth wallet will be String
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
          const account = await backgroundAccount.getAccount(credentials)
          const transactionType = token === 'KOI' ? PENDING_TRANSACTION_TYPE.SEND_KOII : PENDING_TRANSACTION_TYPE.SEND_AR

          console.log('QTY ', qty, 'TARGET ', target, 'TOKEN ', token)
          const txId = await account.method.transfer(token, target, qty)

          const network = await account.get.provider()

          // add new pending transaction
          const pendingTransactionPayload = {
            id: txId,
            activityName: (token === 'KOI' ? 'Sent KOII' : `Sent ${token}`),
            expense: qty,
            target,
            address,
            network,
            retried: 1,
            transactionType
          }
          await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransactionPayload)

          helpers.loadBalances()
          helpers.loadActivities()
          
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
          const { content, tags, fileType, address, price, imageId } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)
          
          const { u8, imageId: _imageId, file } = await helpers.uploadNft.getImageDataForNFT()
          const createdAt = Math.floor(Date.now()/1000).toString()


          // check for imageId
          console.log('Upload NFT [1/6]: check for imageId')
          if (imageId !== _imageId) throw new Error(ERROR_MESSAGE.UPLOAD_NFT.INVALID_CONTENT)


          // create transaction
          console.log('Upload NFT [2/6]: create transaction')
          let transaction
          try {
            transaction = await helpers.uploadNft.createTransaction({
              u8,
              nftContent: content,
              nftTags: tags,
              fileType,
              ownerAddress: address,
              createdAt
            })
          } catch (err) {
            console.error(err.message)
            throw new Error(ERROR_MESSAGE.UPLOAD_NFT.CREATE_TRANSACTION_ERROR)
          }
          console.log('Created transaction: ', transaction)

          
          // sign transaction
          console.log('Upload NFT [3/6]: sign transaction')
          try {
            await account.method.signTx(transaction)
          } catch (err) {
            console.error(err.message)
            throw new Error(ERROR_MESSAGE.UPLOAD_NFT.SIGN_TRANSACTION_ERROR)
          }
          console.log('Signed transaction: ', transaction)


          // get registrationReward data (true -> don't need to register this nft)
          console.log('Upload NFT [4/6]: check hasRegistrationReward')
          let hasRegistrationReward
          try {
            const registrationReward = await account.method.getRegistrationReward(transaction.id)
            hasRegistrationReward = registrationReward.status === 200
          } catch (err) {
            console.error(err.message)
            hasRegistrationReward = false
          }
          console.log('Has registration reward: ', hasRegistrationReward)
          

          // post transaction
          console.log('Upload NFT [5/6]: post transaction')
          try {
            const uploader = await arweave.transactions.getUploader(transaction)
            await uploader.uploadChunk()
          } catch (err) {
            console.error(err.message)
            throw new Error(ERROR_MESSAGE.UPLOAD_NFT.UPLOAD_ERROR)
          }
          console.log('NFT uploaded')


          // register NFT
          console.log('Register NFT [6/6]: register nft')
          if (!hasRegistrationReward) {
            try {
              await account.method.registerNft(transaction.id)
            } catch (err) {
              console.error(err.message)
              throw new Error(ERROR_MESSAGE.UPLOAD_NFT.REGISTER_ERROR)
            }
          }
          console.log('NFT registered')

          const result = { txId: transaction.id, createdAt }
          console.log('Upload NFT result', result)
          // const result = { txId: uuid(), createdAt: 0 }


          // save pending transaction to storage
          const payload = {
            id: transaction.id,
            activityName: `Minted NFT "${content.title}"`,
            expense: price,
            target: null,
            address,
            network: null,
            retried: 1,
            transactionType: PENDING_TRANSACTION_TYPE.MINT_NFT
          }
          await helpers.pendingTransactionFactory.createPendingTransaction(payload)
          
          
          // save pending nft to storage
          const nftPayload = {
            file,
            nftContent: content,
            nftTags: tags,
            nftId: transaction.id,
            fileType,
            ownerAddress: address,
            createdAt
          }
          await helpers.pendingTransactionFactory.createPendingAsset(nftPayload)


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

          // change accountName for activities
          let activities = await account.get.activities()
          activities = activities.map(activity => {
            activity.accountName = newName
            return activity
          })
          await account.set.activities(activities)

          // change accountName for allActivities
          let allActivities = await storage.generic.get.allActivities()
          allActivities = allActivities.map(activity => {
            if (activity?.address === address) activity.accountName = newName
            return activity
          })
          await storage.generic.set.allActivities(allActivities)

          // change accountName for pending transactions
          let pendingTransactions = await account.get.pendingTransactions()
          pendingTransactions = pendingTransactions.map(transaction => {
            transaction.accountName = newName
            return transaction
          })

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

          helpers.loadBalances()          
          helpers.loadActivities()
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
          const { endpoints, friendCode } = message.data
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

            case FRIEND_REFERRAL_ENDPOINTS.SUBMIT_CODE: {
              result = await account.method.submitInviteCode(friendCode)
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
          const { senderAddress, targetAddress, txId, numOfTransfers, tokenAddress, tokenSchema } = message.data

          // get credentials of sender address
          const credentials = await backgroundAccount.getCredentialByAddress(senderAddress)
          const account = await backgroundAccount.getAccount(credentials)
          const typeOfWallet = await backgroundAccount.getType(targetAddress)
          const accountName = await account.get.accountName()

          const result = await account.method.nftBridge({ 
            txId, 
            toAddress: targetAddress, 
            typeOfWallet, 
            tokenAddress, 
            tokenSchema, 
            accountName
          })

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
            error: err.message,
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

          const payload = {
            id: txId,
            activityName: 'Sent NFT',
            expense: 0.000001,
            target: recipientAddress,
            address: senderAddress,
            network: null,
            retried: 1,
            transactionType: PENDING_TRANSACTION_TYPE.SEND_NFT,
            contract: nftId
          }
          await helpers.pendingTransactionFactory.createPendingTransaction(payload)

          // update isSending for nft
          let allAssets = await account.get.assets()
          allAssets = allAssets.map(asset => {
            if (asset.txId === nftId) asset.isSending = true
            return asset
          })

          await account.set.assets(allAssets)

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

      case MESSAGES.HANDLE_EXPIRED_TRANSACTION: {
        try {
          const { txId, address, wantToResend } = message.data
          const credentials = await backgroundAccount.getCredentialByAddress(address)
          const account = await backgroundAccount.getAccount(credentials)

          const pendingTransactions = await account.get.pendingTransactions()
          const transaction = find(pendingTransactions, tx => tx.id === txId)

          if (!transaction) throw new Error('Transaction not found')
        
          if (wantToResend) {
            const newTransactionId = await helpers
              .pendingTransactionFactory
              .resendTransaction(account, transaction)

            port.postMessage({
              type: MESSAGES.HANDLE_EXPIRED_TRANSACTION,
              data: newTransactionId,
              id: messageId
            })
          } else {
            let pendingTransactions = await account.get.pendingTransactions()
            pendingTransactions = pendingTransactions.filter(transaction => {
              return transaction.id  !== txId
            })
            await account.set.pendingTransactions(pendingTransactions)
            port.postMessage({
              type: MESSAGES.HANDLE_EXPIRED_TRANSACTION,
              id: messageId
            })
          }
        } catch (err) {
          port.postMessage({
            type: MESSAGES.HANDLE_EXPIRED_TRANSACTION,
            error: `BACKGROUND ERROR: ${err.message}`,
            id: messageId            
          })
        }
        break
      }

      case MESSAGES.LOAD_FRIEND_REFERRAL_DATA: {
        try {
          const { address } = message.data
          let accounts = []
          if (isString(address)) {
            const credential = await backgroundAccount.getCredentialByAddress(address)
            const account = await backgroundAccount.getAccount(credential)
            accounts = [...accounts, account]
          } else {
            accounts = await backgroundAccount.getAllAccounts(TYPE.ARWEAVE)
          }
          await Promise.all(accounts.map(async account => {
            const code = await account.method.getAffiliateCode()
            const spent = await account.method.checkAffiliateInviteSpent()
            const totalReward = await account.method.getTotalRewardKoi()

            await account.set.affiliateCode(code)
            await account.set.inviteSpent(spent)
            await account.set.totalReward(totalReward)
          }))

          port.postMessage({
            type: MESSAGES.LOAD_FRIEND_REFERRAL_DATA,
            id: messageId
          })

        } catch {
          port.postMessage({
            type: MESSAGES.LOAD_FRIEND_REFERRAL_DATA,
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
