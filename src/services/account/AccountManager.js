import passworder from 'browser-passworder'
import { ACCOUNT, IMPORTED, TYPE } from 'constants/accountConstants'
import { find, get, isEmpty } from 'lodash'
import storage from 'services/storage'
import { ChromeStorage } from 'services/storage/ChromeStorage'
import { setActivatedAccountAddress } from 'utils'

import { Account, ArweaveAccount, EthereumAccount, K2Account, SolanaAccount } from './Account/index'

/* 
  AccountManager classes will be used in account management.
  There are 3 actions we will do with an account instance:
    - Get data from Chrome storage
    - Set data to Chrome storage
    - Run method functions

  On UI side, an instance of PopupAccount class will be used.
  On background side, an instance of BackgroundAccount class will be used.

  The different between PopupAccount and BackgroundAccount:
    - PopupAccount will have functionalities to get the data. It cannot be used to set data to the storage.
    - BackgroundAccount will have full functionalities of get, set, and run method.
  
  To get an instance of a specified account, we need to run getAccount() function which will require a credential object
  as it's parameter. For example:
    backgroundAccount.getAccount({ address, key }) will return an account instance that could be used to get, set or running method functions
    popupAccount.getAccount({ address }) will return an account instance the could be use to get data.

  backgroundAccount and popupAccount will be exported in ./index.
  
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

      // const provider = await this.#getProviderFromAddress(get(credentials, 'address'))

      // const provider = 'https://rinkeby.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'

      const provider =
        (await storage.setting.get.ethereumProvider()) ||
        'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'

      const solProvider = (await storage.setting.get.solanaProvider()) || 'testnet'

      // TODO DatH - LongP: change to koii provider
      const k2Provider = (await storage.setting.get.k2Provider()) || 'testnet'

      switch (type) {
        case TYPE.ARWEAVE:
          return new ArweaveAccount(credentials)
        case TYPE.ETHEREUM:
          return new EthereumAccount(credentials, provider)
        case TYPE.SOLANA:
          return new SolanaAccount(credentials, solProvider)
        case TYPE.K2:
          return new K2Account(credentials, k2Provider)
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * @param {String} network TYPE.ARWEAVE or TYPE.ETHEREUM (TYPE could be imported from constants/accountConstants)
   * @returns {Array} [account1, account2]
   */
  async getAllAccounts(network) {
    try {
      if (!network) {
        const allAccounts = await Promise.all(
          this.importedAccount.map(async (credentials) => {
            return await this.getAccount(credentials)
          })
        )
        return allAccounts
      } else {
        let accounts
        console.log('importedAccount', this.importedAccount)
        accounts = this.importedAccount.filter((a) => a.type === network)
        accounts = await Promise.all(
          accounts.map(async (credentials) => await this.getAccount(credentials))
        )
        return accounts
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   *
   * @param {String} address
   * @returns {String} walletType TYPE.ARWEAVE or TYPE.ETHEREUM
   */
  async getType(address) {
    try {
      const importedArweave = await this.storage._getChrome(IMPORTED.ARWEAVE)
      const importedEthereum = await this.storage._getChrome(IMPORTED.ETHEREUM)
      const importedSolana = await this.storage._getChrome(IMPORTED.SOLANA)
      const importedK2 = await this.storage._getChrome(IMPORTED.K2)

      if (find(importedArweave, (v) => v.address === address)) return TYPE.ARWEAVE
      if (find(importedK2, (v) => v.address === address)) return TYPE.K2
      if (find(importedEthereum, (v) => v.address === address)) return TYPE.ETHEREUM

      // TODO DatH - LongP HIGH PRIORITY: solve problem SOLANA and K2 have same address
      if (find(importedSolana, (v) => v.address === address)) return TYPE.SOLANA
    } catch (err) {
      err.message
    }
  }

  /**
   * This function will load wallet data from Chrome storage to this.importedAccount
   *  For example: On the storage we have: [{address1, key1}, {address2, key2}]
   * after run loadImported() we will have:
   * this.importedAccount = [{address1, key1}, {address2, key2}]
   */
  async loadImported() {
    try {
      const importedK2 = (await this.storage._getChrome(IMPORTED.K2)) || []
      const importedEthereum = (await this.storage._getChrome(IMPORTED.ETHEREUM)) || []
      const importedSolana = (await this.storage._getChrome(IMPORTED.SOLANA)) || []
      const importedArweave = (await this.storage._getChrome(IMPORTED.ARWEAVE)) || []

      this.importedAccount = [
        ...importedK2,
        ...importedEthereum,
        ...importedSolana,
        ...importedArweave
      ]
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * Input {network} to get count of a specified wallet type
   * If network = undefined, the function will return count of all imported accounts.
   * @param {String} network TYPE.ARWEAVE or TYPE.ETHEREUM
   * @returns {Number} count
   */
  async count(network) {
    try {
      const importedArweave = (await this.storage._getChrome(IMPORTED.ARWEAVE)) || []
      const importedEthereum = (await this.storage._getChrome(IMPORTED.ETHEREUM)) || []
      const importedSolana = (await this.storage._getChrome(IMPORTED.SOLANA)) || []
      const importedK2 = (await this.storage._getChrome(IMPORTED.K2)) || []

      switch (network) {
        case TYPE.ARWEAVE:
          return importedArweave.length
        case TYPE.ETHEREUM:
          return importedEthereum.length
        case TYPE.SOLANA:
          return importedSolana.length
        case TYPE.K2:
          return importedK2.length
      }

      return (
        importedArweave.length + importedEthereum.length + importedSolana.length + importedK2.length
      )
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * This function will be used to check if an Arweave wallet has been imported.
   * The reason why we need this function is to handle the situation of when the user has only Ethereum wallet imported.
   * If there's an imported Ethereum wallet, and no imported Arweave wallet, we have to hide some functionalities that will work
   * with Arweave only.
   * @returns {Boolean} hasArweave
   */
  async hasArweave() {
    const importedArweave = (await this.storage._getChrome(IMPORTED.ARWEAVE)) || []
    return !isEmpty(importedArweave)
  }

  async #getProviderFromAddress(address) {
    const metadata = await this.storage._getChrome(address)
    return get(metadata, ACCOUNT.PROVIDER)
  }
}

/* 
  This class will be used to get data for accounts on UI code.  
*/
export class PopupAccountManager extends AccountManager {
  constructor() {
    super()
  }

  /**
   *
   * @param {Object} credentials
   * @param {String} credentials.address wallet address
   * @returns {Account} account
   */
  async getAccount(credentials) {
    try {
      const { address } = credentials

      return new Account(address)
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   *
   * @param {String} network TYPE.ARWEAVE or TYPE.ETHEREUM
   * @returns
   */
  async getAllMetadata(network) {
    try {
      const allAccounts = await this.getAllAccounts(network)
      return await Promise.all(allAccounts.map(async (account) => await account.get.metadata()))
    } catch (err) {
      console.log(err.message)
    }
  }

  /**
   * Return an array of all assets and pendingAssets
   * @returns
   */
  async getAllAssets() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allAssets = []
      for (let i = 0; i < allAccounts.length; i++) {
        const account = allAccounts[i]
        const assets = (await account.get.assets()) || []
        const pendingAssets = (await account.get.pendingAssets()) || []
        allAssets = [...allAssets, ...assets, ...pendingAssets]
      }

      return allAssets
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllCollectionNfts() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allCollectionNfts = []
      await Promise.all(
        allAccounts.map(async (account) => {
          const collections = (await account.get.collectionNfts()) || []
          allCollectionNfts = [...allCollectionNfts, ...collections]
        })
      )

      return allCollectionNfts
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllCollections() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allCollections = []
      await Promise.all(
        allAccounts.map(async (account) => {
          const collections = (await account.get.collections()) || []
          allCollections = [...allCollections, ...collections]
        })
      )

      return allCollections
    } catch (err) {
      console.log(err.message)
    }
  }

  async getAllPendingTransactions() {
    try {
      const allAccounts = await this.getAllAccounts()
      let allPendingTransactions = []
      await Promise.all(
        allAccounts.map(async (account) => {
          const transactions = (await account.get.pendingTransactions()) || []
          allPendingTransactions = [...allPendingTransactions, ...transactions]
        })
      )

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

  async getNewAccountName() {
    const allAccounts = await this.getAllAccounts()
    const accountNames = await Promise.all(allAccounts.map((account) => account.get.accountName()))

    let index = 1
    let newAccountName = `NODE ACCOUNT ${index}`
    while (accountNames.includes(newAccountName)) {
      index += 1
      newAccountName = `NODE ACCOUNT ${index}`
    }

    return newAccountName
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
        Base on the "type", we will add the wallet into different array of wallet.
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
          break
        case TYPE.SOLANA:
          chain = IMPORTED.SOLANA
          break
        case TYPE.K2:
          chain = IMPORTED.K2
          break
      }

      importedWallets = (await this.storage._getChrome(chain)) || []
      if (!find(importedWallets, (v) => v.address == address))
        importedWallets.push({ address, encryptedKey, type })
      await this.storage._setChrome(chain, importedWallets) // save to wallets array

      const newImported = { address, key, type }
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
          break
        case TYPE.SOLANA:
          chain = IMPORTED.SOLANA
          break
        case TYPE.K2:
          chain = IMPORTED.K2
          break
      }

      importedWallets = (await this.storage._getChrome(chain)) || []
      importedWallets = importedWallets.filter((payload) => address !== payload.address)
      await this.storage._setChrome(chain, importedWallets)

      await this.storage._removeChrome(address)
      await this.storage._removeChrome(`${address}_assets`)
      await this.storage._removeChrome(`${address}_pendingAssets`)
      await this.storage._removeChrome(`${address}_collections`)

      /* 
      Have to handle removing this address from activatedAccount if this
      address is the activated account.
      */
      await this.removeFromImported(address)
      if (this.importedAccount.length) {
        const currentActivatedAccount = await storage.setting.get.activatedArweaveAccountAddress()
        if (address === currentActivatedAccount) {
          /*
            set new activatedAccount after remove activatedAccount
          */
          const defaultActivatedAccount = find(this.importedAccount, { type: TYPE.ARWEAVE })
          if (!isEmpty(defaultActivatedAccount)) {
            await setActivatedAccountAddress(defaultActivatedAccount.address, TYPE.ARWEAVE)
          } else {
            await storage.setting.set.activatedArweaveAccountAddress(null)
          }
        }

        const currentEthereumActivatedAccount = await storage.setting.get.activatedEthereumAccountAddress()
        if (address === currentEthereumActivatedAccount) {
          /*
            set new activatedAccount after remove activatedAccount
          */
          const defaultActivatedAccount = find(this.importedAccount, { type: TYPE.ETHEREUM })
          if (!isEmpty(defaultActivatedAccount)) {
            await setActivatedAccountAddress(defaultActivatedAccount.address, TYPE.ETHEREUM)
          } else {
            await storage.setting.set.activatedEthereumAccountAddress(null)
          }
        }

        const currentSolanaActivatedAccount = await storage.setting.get.activatedSolanaAccountAddress()
        if (address === currentSolanaActivatedAccount) {
          const defaultActivatedAccount = find(this.importedAccount, { type: TYPE.SOLANA })
          if (!isEmpty(defaultActivatedAccount)) {
            await setActivatedAccountAddress(defaultActivatedAccount, TYPE.SOLANA)
          } else {
            await storage.setting.set.activatedSolanaAccountAddress(null)
          }
        }

        const currentK2ActivatedAccount = await storage.setting.get.activatedK2AccountAddress()
        if (address === currentK2ActivatedAccount) {
          const defaultActivatedAccount = find(this.importedAccount, { type: TYPE.K2 })
          if (!isEmpty(defaultActivatedAccount)) {
            await setActivatedAccountAddress(defaultActivatedAccount, TYPE.K2)
          } else {
            await storage.setting.set.activatedK2AccountAddress(null)
          }
        }
      } else {
        await storage.setting.set.activatedArweaveAccountAddress(null)
        await storage.setting.set.activatedEthereumAccountAddress(null)
        await storage.setting.set.activatedSolanaAccountAddress(null)
        await storage.setting.set.activatedK2AccountAddress(null)
      }

      await storage.setting.set.siteConnectedAddresses({})
    } catch (err) {
      console.log(err.message)
    }
  }

  async unlockImportedAccount(password) {
    try {
      if (password) {
        await this.loadImported()
        this.importedAccount = await Promise.all(
          this.importedAccount.map(async (credentials) => {
            const decryptedKey = await passworder.decrypt(password, credentials.encryptedKey)
            credentials['key'] = decryptedKey

            return credentials
          })
        )
      } else {
        throw new Error(chrome.i18n.getMessage('passwordRequired'))
      }
    } catch (err) {
      this.importedAccount = []
      throw new Error(err.message)
    }
  }

  async addToImported(credentials) {
    this.importedAccount.push(credentials)
  }

  async removeFromImported(address) {
    this.importedAccount = this.importedAccount.filter((account) => account.address !== address)
  }

  async getCredentialByAddress(address) {
    try {
      return find(this.importedAccount, (v) => v.address == address)
    } catch (err) {
      console.log(err.message)
    }
  }

  async getEncryptedKey(address) {
    try {
      const type = await this.getType(address)
      let importedWallets
      switch (type) {
        case TYPE.ARWEAVE:
          importedWallets = await this.storage._getChrome(IMPORTED.ARWEAVE)
          break
        case TYPE.ETHEREUM:
          importedWallets = await this.storage._getChrome(IMPORTED.ETHEREUM)
          break
        case TYPE.SOLANA:
          importedWallets = await this.storage._getChrome(IMPORTED.SOLANA)
          break
        case TYPE.K2:
          importedWallets = await this.storage._getChrome(IMPORTED.K2)
          break
      }

      const wallet = find(importedWallets, (v) => v.address == address)
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
      const importedArweave = (await this.storage._getChrome(IMPORTED.ARWEAVE)) || []
      const importedEthereum = (await this.storage._getChrome(IMPORTED.ETHEREUM)) || []
      const importedSolana = (await this.storage._getChrome(IMPORTED.SOLANA)) || []
      const importedK2 = (await this.storage._getChrome(IMPORTED.K2)) || []

      const allCredentials = [
        ...importedArweave,
        ...importedEthereum,
        ...importedSolana,
        ...importedK2
      ]

      await Promise.all(
        allCredentials.map(async (credential) => {
          const data = await this.storage._getChrome(credential.address)
          data[ACCOUNT.CONNECTED_SITE] = []
          await this.storage._setChrome(credential.address, data)
        })
      )
    } catch (err) {
      console.log(err.message)
    }
  }
}
