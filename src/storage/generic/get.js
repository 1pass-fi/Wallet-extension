import { ChromeStorage } from '../ChromeStorage'
import { GENERIC } from '../storageConstants'

export class GenericGet {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }
  /**
   * 
   * @returns {Object} Pending transaction object
   */
  pendingRequest() {
    return this.#chrome._getChrome(GENERIC.PENDING_REQUEST)
  }
  /**
   * 
   * @returns {Number} Koi balance
   */
  koiBalance() {
    return this.#chrome._getChrome(GENERIC.KOI_BALANCE)
  }
  /**
   * 
   * @returns {String} 3 characters of currency. Example: 'USD'
   */
  selectedCurrency() {
    return this.#chrome._getChrome(GENERIC.SELECTED_CURRENCY)
  }
  /**
   * 
   * @returns {Array} Array of connected site origins.
   */
  connectedSites() {
    return this.#chrome._getChrome(GENERIC.CONNECTED_SITE)
  }
  /**
   * 
   * @returns {String} Name of this account.
   */
  accountName() {
    return this.#chrome._getChrome(GENERIC.ACCOUNT_NAME)
  }
  /**
   * 
   * @returns {String} Friend referral code
   */
  affiliateCode() {
    return this.#chrome._getChrome(GENERIC.AFFILIATE_CODE)
  }
  /**
   * 
   * @returns {Boolean} State of locked/unlocked
   */
  unlocked() {
    return this.#chrome._getChrome(GENERIC.UNLOCKED)
  }
}
