import { AccountChromeStorage } from '../../storage/ChromeStorage'
import { ACCOUNT } from '../accountConstants'

export class WalletSet {
  #address
  #accountStorage
  constructor(address) {
    this.#address = address
    this.#accountStorage = new AccountChromeStorage(this.#address)
  }

  /**
   * 
   * @returns {String} Wallet address
   */
  async address(value) {
    return this.#accountStorage.setField(ACCOUNT.ADDRESS, value)
  }
  /**
     * 
     * @returns {JSON} Encrypted Keyfile JSON
     */
  async key(value) {
    return await this.#accountStorage.setField(ACCOUNT.KEY, value)
  }
  /**
     * 
     * @returns {JSON} Encrypted Seed phrase JSON
     */
  async seedPhrase(value) {
    return this.#accountStorage.setField(ACCOUNT.SEED_PHRASE, value)
  }
  /**
     * 
     * @returns {Number} Total Balance
     */
  async balance(value) {
    return await this.#accountStorage.setField(ACCOUNT.BAlANCE, value)
  }

  async koiBalance(value) {
    return await this.#accountStorage.setField(ACCOUNT.KOI_BALANCE, value)
  }
  /**
     * 
     * @returns {Array} List of NFTs
     */
  async assets(value) {
    return await this.#accountStorage.setAssets(value)
  }
  /**
     * 
     * @returns {Array} List of Activities
     */
  async activities(value) {
    return await this.#accountStorage.setField(ACCOUNT.ACTIVITIES, value)
  }
  /**
     * 
     * @returns {Number} Price of token
     */
  async price(value) {
    return await this.#accountStorage.setField(ACCOUNT.PRICE, value)
  }
  /**
     * 
     * @returns {Array} List of pending transacitons
     */
  async pendingTransactions(value) {
    return await this.#accountStorage.setField(ACCOUNT.PENDING_TRANSACTION, value)
  }
  /**
     * 
     * @returns {String} Account name for the wallet.
     */
  async accountName(value) {
    return await this.#accountStorage.setField(ACCOUNT.ACCOUNT_NAME, value)
  }
  /**
     * 
     * @returns {Array} list of collections
     */
  async collections(value) {
    return await this.#accountStorage.setField(ACCOUNT.COLLECTIONS, value)
  }
}
