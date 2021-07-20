import { WalletChromeStorage } from '../ChromeStorage'
import { WALLET } from '../storageConstants'
export class WalletGet {
  #wallet
  #network
  constructor(network) {
    this.#network = network
    this.#wallet = new WalletChromeStorage(this.#network)
  }

  /**
   * 
   * @returns {String} Wallet address
   */
  address() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.ADDRESS))
  }
  /**
   * 
   * @returns {JSON} Encrypted Keyfile JSON
   */
  key() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.KEY))
  }
  /**
   * 
   * @returns {JSON} Encrypted Seed phrase JSON
   */
  seedPhrase() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.SEED_PHRASE))
  }
  /**
   * 
   * @returns {Number} Total Balance
   */
  balance() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.BALANCE))
  }
  /**
   * 
   * @returns {Array} List of NFTs
   */
  assets() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.ASSETS))
  }
  /**
   * 
   * @returns {Array} List of Activities
   */
  activities() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.ACTIVITIES))
  }
  /**
   * 
   * @returns {Number} Price of token
   */
  price() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.PRICE))
  }
  /**
   * 
   * @returns {Array} List of pending transacitons
   */
  pendingTransactions() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.PENDING_TRANSACTIONS))
  }
  /**
   * 
   * @returns {String} Account name for the wallet.
   */
  accountName() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.ACCOUNT_NAME))
  }
  /**
   * 
   * @returns {Array} list of collections
   */
  collections() {
    return this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.COLLECTIONS))
  }
}
