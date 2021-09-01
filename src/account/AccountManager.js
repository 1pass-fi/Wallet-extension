import passworder from 'browser-passworder'
import { find, get } from 'lodash'

import { Account, ArweaveAccount, EthereumAccount } from './Account/index'

import { IMPORTED, TYPE } from './accountConstants'
import { ChromeStorage } from 'storage/ChromeStorage'

import { ERROR_MESSAGE } from 'koiConstants'
import { ACCOUNT } from 'account/accountConstants'

import storage from 'storage'

/* 
  Background and Popup will use different classes.
  - On popup and contentscript, basically, we will only need to get data. PopupAccount's instance, when
  run getAccount(), will return an instance of class WalletPopup which has the ability to get 
  data of accounts.
  - On background we will use a another class which is BackgroundAccount, an instance of this class, when
  run getAccount(), will return an instance of Arweave or Ethereum class bases on type of chain of the 
  input address. This account object will have ability to get, set and run method functions.
  The idea when we separate the way of managing account on Background and Popup is to prevent saving
  keyfile directly to the storage.
  Keyfile, after an account is imported, will be pushed into an array which is an attribute of
  backgroundAccount - instance of BackgroundAccount.
*/
class AccountManager {
  constructor() {
    this.storage = new ChromeStorage()
    this.importedAccount = []
  }

  /**
   * 
   * @param {Object} credentials
   * @param {Object} credentials.key Wallet key
   * @param {String} credentials.address Wallet address
   * @returns {Arweave} account
   */
  async getAccount(credentials) {
    try {
      const { address } = credentials
      const type = await this.getType(address)

      const provider = await this.#getProviderFromAddress(get(credentials, 'address'))
  
      switch(type) {
        case TYPE.ARWEAVE:
          return new ArweaveAccount(credentials)
        case TYPE.ETHEREUM:
          return new EthereumAccount(credentials, provider)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * 
   * @returns 
   */
  async getAllAccounts() {
    try {
      const allAccounts = await Promise.all(this.importedAccount.map(async credentials => {
        return await this.getAccount(credentials)
      }))
  
      return allAccounts
    } catch (err) {
      console.log(err.message)
    }
  }

  async getType(address) {
    try {
      const importedArweave = await this.storage._getChrome(IMPORTED.ARWEAVE)
      const importedEthereum = await this.storage._getChrome(IMPORTED.ETHEREUM)
  
      if (find(importedArweave, v => v.address == address)) return TYPE.ARWEAVE
      if (find(importedEthereum, v => v.address == address)) return TYPE.ETHEREUM
    } catch (err) {
      err.message
    }
  }

  async loadImported() {
    try {
      const importedArweave = await this.storage._getChrome(IMPORTED.ARWEAVE) || []
      const importedEthereum = await this.storage._getChrome(IMPORTED.ETHEREUM) || []
  
      this.importedAccount = [...importedArweave, ...importedEthereum]
    } catch (err) {
      console.log(err.message)
    }
  }

  async count() {
    try {
      const importedArweave = await this.storage._getChrome(IMPORTED.ARWEAVE) || []
      const importedEthereum = await this.storage._getChrome(IMPORTED.ETHEREUM) || []
  
      return importedArweave.length + importedEthereum.length
    } catch (err) {
      console.log(err.message)
    }
  }

  async #getProviderFromAddress(address) {
    const metadata = await this.storage._getChrome(address)
    return get(metadata, ACCOUNT.PROVIDER)
  }
}

/* 
  Get data only.
*/
export class PopupAccountManager extends AccountManager {
  constructor() {
    super()
  }

  async getAccount(credentials) {
    try {
      const { address } = credentials
  
      return new Account(address)
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllAccounts() {
    try {
      const allAccounts = await Promise.all(this.importedAccount.map(async credentials => {
        return await this.getAccount(credentials)
      }))
  
      return allAccounts
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllMetadata() {
    try {
      const allAccounts = await this.getAllAccounts()
      return await Promise.all(allAccounts.map(async account => await account.get.metadata()))
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllAssets() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allAssets = []
      await Promise.all(allAccounts.map(async account => {
        const assets = await account.get.assets() || []
        const pendingAssets = await account.get.pendingAssets() || []
        allAssets = [...allAssets, ...assets, ...pendingAssets]
      }))

      return allAssets
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllCollections() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allCollections = []
      await Promise.all(allAccounts.map(async account => {
        const collections = await account.get.collections() || []
        allCollections = [...allCollections, ...collections]
      }))

      return allCollections
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllPendingTransactions() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allPendingTransactions = []
      await Promise.all(allAccounts.map(async account => {
        const transactions = await account.get.pendingTransactions() || []
        allPendingTransactions = [...allPendingTransactions, ...transactions]
      }))

      return allPendingTransactions
    } catch (err) {
      console.log(err.message)
    }
  }
}

export class BackgroundAccountManager extends AccountManager {
  constructor() {
    super()
  }

  async createAccount(address, key, password, type) {
    try {
      const encryptedKey = await passworder.encrypt(password, key)
      const payload = { ADDRESS: address, TYPE: type }
      /* 
        Beside adding wallet info into the array of wallets, we also need to save it's metadata directly to the storage,
        the field name should be it's address. For example:
        { exampleAddress: { BALANCE: 100, KOIBALANCE: 200, PRICE: 8.2 } }
      */
      await this.storage._setChrome(address, payload)

      /* 
        Base on the input type we will add the wallet into different array of wallet.
        Currently we have Arweave and Ethereum.
      */
      let importedWallets
      let chain
      switch (type) {
        case TYPE.ARWEAVE:
          chain = IMPORTED.ARWEAVE
          break
        case TYPE.ETHEREUM:
          chain = IMPORTED.ETHEREUM
      }

      importedWallets = await this.storage._getChrome(chain) || []
      if (!find(importedWallets, v => v.address == address)) importedWallets.push({ address, encryptedKey })
      await this.storage._setChrome(chain, importedWallets) // save to wallets array

      const newImported = { address, key }
      this.addToImported(newImported)
    } catch (err) {
      console.log(err.message)
    }
  }

  async removeAccount(address) {
    const type = await this.getType(address)
    try {
      let importedWallets
      let chain
      switch (type) {
        case TYPE.ARWEAVE:
          chain = IMPORTED.ARWEAVE
          break
        case TYPE.ETHEREUM:
          chain = IMPORTED.ETHEREUM
      }

      importedWallets = await this.storage._getChrome(chain) || []
      importedWallets = importedWallets.filter(payload => address !== payload.address)
      await this.storage._setChrome(chain, importedWallets)

      await this.storage._removeChrome(address)
      await this.storage._removeChrome(`${address}_assets`)
      await this.storage._removeChrome(`${address}_collections`)

      /* 
      Have to handle removing this address from activatedAccount if this
      address is the activated account.
      */
     
      await this.removeFromImported(address)
      if (this.importedAccount.length){
        const currentActivatedAccount = await storage.setting.get.activatedAccountAddress()
        if (address !== currentActivatedAccount) {
          return
        }
        /*
          set new activatedAccount after remove activatedAccount
        */
        const defaultActivatedAccount = this.importedAccount[0].address
        await storage.setting.set.activatedAccountAddress(defaultActivatedAccount)
      } else {
        await storage.setting.set.activatedAccountAddress(null)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  async unlockImportedAccount(password) {
    try {
      if (password) {
        await this.loadImported()
        this.importedAccount = await Promise.all(this.importedAccount.map(async credentials => {
          const decryptedKey = await passworder.decrypt(password, credentials.encryptedKey)
          credentials['key'] = decryptedKey

          return credentials
        }))
      } else {
        throw new Error(ERROR_MESSAGE.PASSWORD_REQUIRED)
      }
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async addToImported(credentials) {
    this.importedAccount.push(credentials)
  }

  async removeFromImported(address) {
    this.importedAccount = this.importedAccount.filter(account => account.address !== address)
  }

  async getCredentialByAddress(address) {
    try {
      return find(this.importedAccount, v => v.address == address)
    } catch (err) {
      console.log(err.message)
    }
  }

  async getEncryptedKey(address) {
    try {
      const type = await this.getType(address)
      let importedWallets
      switch(type) {
        case TYPE.ARWEAVE:
          importedWallets = await this.storage._getChrome(IMPORTED.ARWEAVE)
          break
        case TYPE.ETHEREUM:
          importedWallets = await this.storage._getChrome(IMPORTED.ETHEREUM)
      }

      const wallet = find(importedWallets, v => v.address == address)
      if (wallet) return get(wallet, 'encryptedKey')

    } catch (err) {
      console.log(err.message)
    }
  }

  async removeAllImported() {
    this.importedAccount = []
  }

  /* 
    Remove connected sites of all accounts when user locked their wallet or when
    extension just reloaded.
  */
  async removeConnectedSite() {
    try {
      const importedArweave = await this.storage._getChrome(IMPORTED.ARWEAVE) || []
      const importedEthereum = await this.storage._getChrome(IMPORTED.ETHEREUM) || []

      const allCredentials = [...importedArweave, ...importedEthereum]

      await Promise.all(allCredentials.map(async credential => {
        const data = await this.storage._getChrome(credential.address)
        data[ACCOUNT.CONNECTED_SITE] = []
        await this.storage._setChrome(credential.address, data)
      }))
    } catch (err) {
      console.log(err.message)
    }
  }
}

export const backgroundAccount = new BackgroundAccountManager()
export const popupAccount = new PopupAccountManager()
