import { Arweave } from './Arweave'
import { Ethereum } from './Ethereum'
import { ADDRESSES, IMPORTED, TYPE } from './accountConstants'
import { ChromeStorage } from 'storage/ChromeStorage'
import passworder from 'browser-passworder'

import { find } from 'lodash'

import { getChromeStorage } from 'utils'
import { WalletPopup } from 'account/Wallet'


export class Account {

  static #chrome = new ChromeStorage()

  /**
   * Add a new wallet to the array of wallets.
   * Required fields: { address, key, encryptedKey }
   * @param {String} address Address of wallet
   * @param {JSON} key JSON Wallet key
   * @param {String} password Password to encrypt key and seedPhrase
   * @param {String} type TYPE.ARWEAVE or TYPE.ETHEREUM (import from /account/accountConstants)
   */
  static async create(address, key, password, type) {
    try {
      let wallets

      const encryptedKey = await passworder.encrypt(password, key)

      const payload = { ADDRESS: address, TYPE: type, ENCRYPTED_KEY: encryptedKey }
      /* 
        Beside adding wallet info into the array of wallets, we also need to save it's extra data directly to the storage,
        the field name should be it's address. For example:
        { exampleAddress: { BALANCE: 100, KOIBALANCE: 200, PRICE: 8.2 } }
      */
      await this.#chrome._setChrome(address, payload)

      /* 
        Base on the input type we will add the wallet into different array of wallet.
        Currently we have Arweave and Ethereum.
      */
      switch (type) {
        case TYPE.ARWEAVE:
          wallets = await this.#chrome._getChrome(ADDRESSES.ARWEAVE) || []
          if (!find(wallets, v => v.address == address)) wallets = [...wallets, { address, key, encryptedKey }]
          console.log('address: ', address, '; wallets: ', wallets)
          await this.#chrome._setChrome(ADDRESSES.ARWEAVE, wallets) // save to arweave wallets array
          break
        case TYPE.ETHEREUM:
          wallets = await this.#chrome._getChrome(ADDRESSES.ETHEREUM) || []
          if (!find(wallets, v => v.address == address)) wallets = [...wallets, { address, key, encryptedKey }]
          await this.#chrome._setChrome(ADDRESSES.ETHEREUM, wallets) // save to ethereum wallets array
          break
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * Remove wallet from the array of wallets, and also remove it's data
   * @param {String} address Address of wallet
   */
  static async remove(address, type) {
    try {
      let wallets
      console.log('type from account class: ', type)
      switch (type) {
        case TYPE.ARWEAVE:
          wallets = await this.#chrome._getChrome(ADDRESSES.ARWEAVE)
          wallets = wallets.filter(payload => address !== payload.address)
          await this.#chrome._setChrome(ADDRESSES.ARWEAVE, wallets)
          break
        case TYPE.ETHEREUM:
          wallets = await this.#chrome._getChrome(ADDRESSES.ETHEREUM)
          wallets = wallets.filter(payload => address !== payload.address)
          await this.#chrome._setChrome(ADDRESSES.ETHEREUM, wallets)
      }
      await this.#chrome._removeChrome(address)
    } catch (err) {
      console.log(err.message)
    }
  }

  /* 
    Every account will have it's koi object
    Need to provide address and key
  */
  static get(payload, type) {
    switch(type) {
      case TYPE.ARWEAVE:
        return new Arweave(payload)
      case TYPE.ETHEREUM:
        return new Ethereum(payload)
    }
  }

  /* 
    This function will return an array of accounts.
    An account is an instance of Arweave or Ethereum class.
  */
  static async getAll() {
    let arweaveAddresses = (await getChromeStorage(ADDRESSES.ARWEAVE))[ADDRESSES.ARWEAVE] || []
    let ethereumAddresses = (await getChromeStorage(ADDRESSES.ETHEREUM))[ADDRESSES.ETHEREUM] || []

    const arweaveAccounts = arweaveAddresses.map(payload => new Arweave(payload)) // payload: { address, key }
    const ethereumAccounts = ethereumAddresses.map(payload => new Ethereum(payload))

    return [...arweaveAccounts, ...ethereumAccounts]
  }

  /* 
    This function will return an array of all data of wallets.
  */
  static async getAllState() {
    let arweaveAddresses = (await getChromeStorage(ADDRESSES.ARWEAVE))[ADDRESSES.ARWEAVE] || []
    let ethereumAddresses = (await getChromeStorage(ADDRESSES.ETHEREUM))[ADDRESSES.ETHEREUM] || []

    let arweaveAccounts = arweaveAddresses.map(payload => new Arweave(payload)) // payload: { address, key }
    let ethereumAccounts = ethereumAddresses.map(payload => new Ethereum(payload))

    arweaveAccounts = await Promise.all(arweaveAccounts.map(async account => await account.get.getAllFields()))
    ethereumAccounts = await Promise.all(ethereumAccounts.map(async account => await account.get.getAllFields()))

    return [...arweaveAccounts, ...ethereumAccounts]
  }

  static async getAllEthereumWallet() {
    const ethereumAddresses = (await getChromeStorage(ADDRESSES.ETHEREUM))[ADDRESSES.ETHEREUM] || []
    const accounts = await Promise.all(ethereumAddresses.map(async payload => await getChromeStorage(payload)))

    return accounts
  }

  static async getAllArweaveWallet() {
    const arweaveAddresses = (await getChromeStorage(ADDRESSES.ARWEAVE))[ADDRESSES.ARWEAVE] || []
    const accounts = await Promise.all(arweaveAddresses.map(async payload => await getChromeStorage(payload)))

    return accounts
  }

  static async getAllWallets() {
    const arweaveWallets = await this.#chrome._getChrome([ADDRESSES.ARWEAVE]) || []
    const ethereumWallets = await this.#chrome._getChrome([ADDRESSES.ETHEREUM]) || []

    return [...arweaveWallets, ...ethereumWallets]
  }

  static async getTypeOfWallet(address) {
    let arweaveWallets = (await getChromeStorage(ADDRESSES.ARWEAVE))[ADDRESSES.ARWEAVE] || []
    let ethereumWallets = (await getChromeStorage(ADDRESSES.ETHEREUM))[ADDRESSES.ETHEREUM] || []

    if (find(arweaveWallets, v => v.address == address)) return TYPE.ARWEAVE
    if (find(ethereumWallets, v => v.address == address)) return TYPE.ETHEREUM
  }
}


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
class GenericAccount {
  constructor() {
    this.storage = new ChromeStorage()
    this.importedAccount = []
  }

  async getAccount(credentials) {
    try {
      const { address } = credentials
      const type = await this.getType(address)
  
      switch(type) {
        case TYPE.ARWEAVE:
          return new Arweave(credentials)
        case TYPE.ETHEREUM:
          return new Ethereum(credentials)
      }
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
}

export class PopupAccount extends GenericAccount {
  constructor() {
    super()
  }

  async getAccount(credentials) {
    try {
      const { address } = credentials
  
      return new WalletPopup(address)
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
}

export class BackgroundAccount extends GenericAccount {
  constructor() {
    super()
  }

  async createAccount(address, key, password, type) {
    try {
      const encryptedKey = await passworder.encrypt(password, key)
      console.log('BackgroundAccount encryptedKey', encryptedKey)
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

      await this.removeFromImported(address)
    } catch (err) {
      console.log(err.message)
    }
  }

  async unlockImportedAccount(password) {
    if (password) {
      await this.loadImported()
  
      this.importedAccount = await Promise.all(this.importedAccount.map(async credentials => {
        const decryptedKey = await passworder.decrypt(password, credentials.encryptedKey)
        credentials[key] = decryptedKey
      }))
    }
  }

  async addToImported(credentials) {
    this.importedAccount.push(credentials)
  }

  async removeFromImported(address) {
    this.importedAccount = this.importedAccount.filter(account => account.address !== address)
  }
}

export const backgroundAccount = new BackgroundAccount()
export const popupAccount = new PopupAccount()
