import { WalletChromeStorage } from '../ChromeStorage'
import { WALLET } from '../storageConstants'
export class WalletRemove {
  #wallet
  #network
  constructor(network) {
    this.#network = network
    this.#wallet = new WalletChromeStorage(this.#network)
  }
  
  async address() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.ADDRESS))
  }

  async key() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.KEY))
  }

  async seedPhrase() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.SEED_PHRASE))
  }

  async balance() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.BALANCE))
  }

  async assets() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.ASSETS))
  }

  async activities() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.ACTIVITIES))
  }

  async price() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.PRICE))
  }

  async pendingTransactions() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.PENDING_TRANSACTIONS))
  }

  async accountName() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.ACCOUNT_NAME))
  }

  async collections() {
    return this.#wallet._removeChrome(this.#wallet._getKeyWord(WALLET.COLLECTIONS))
  }
}
