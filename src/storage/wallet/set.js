import { WalletChromeStorage } from '../ChromeStorage'
import { WALLET } from '../storageConstants'
export class WalletSet {
  #wallet
  #network
  constructor(network) {
    this.#network = network
    this.#wallet = new WalletChromeStorage(this.#network)
  }

  /**
   * 
   * @param {String} value Wallet address string 
   * @returns 
   */
  async address(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.ADDRESS), value)
  }
  /**
   * 
   * @param {JSON} value Wallet key JSON 
   * @returns 
   */
  async key(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.KEY), value)
  }
  /**
   * 
   * @param {String} value Seed phrase string
   * @returns 
   */
  async seedPhrase(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.SEED_PHRASE), value)
  }
  /**
   * 
   * @param {Number} value Balance amount
   * @returns 
   */
  async balance(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.BALANCE), value)
  }
  /**
   * 
   * @param {Array} value Array of NFTs
   * @returns 
   */
  async assets(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.ASSETS), value)
  }
  /**
   * 
   * @param {Array} value Array of transactions
   * @returns 
   */
  async activities(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.ACTIVITIES), value)
  }
  /**
   * 
   * @param {Number} value Price of token 
   * @returns 
   */
  async price(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.PRICE), value)
  }
  /**
   * 
   * @param {Array} value Array of pending transactions 
   */
  async pendingTransactions(value) {
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.PENDING_TRANSACTIONS), value)
  }
  /**
   * 
   * @param {String} value Account name for the account.
   * @returns 
   */
  accountName(value) {
    return this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.ACCOUNT_NAME), value)
  }
  /**
   * 
   * @param {Array} value list of collections 
   * @returns 
   */
  collections(value) {
    return this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.COLLECTIONS), value)
  }
}
