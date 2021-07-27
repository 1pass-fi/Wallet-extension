import { Arweave } from './Arweave'
import { Ethereum } from './Ethereum'
import { ADDRESSES, TYPE } from './accountConstants'
import { ChromeStorage } from 'storage/ChromeStorage'
import passworder from 'browser-passworder'

import { find } from 'lodash'

import { getChromeStorage } from 'utils'


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
