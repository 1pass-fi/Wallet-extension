import { ChromeStorage } from '../ChromeStorage'
import { GENERIC } from 'constants/storageConstants'

export class GenericGet {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }
  /**
   * 
   * @returns {Object} Pending transaction object
   */
  async pendingRequest() {
    return await this.#chrome._getChrome(GENERIC.PENDING_REQUEST) || {}
  }
  /**
   * 
   * @returns {Number} Koi balance
   */
  async koiBalance() {
    return await this.#chrome._getChrome(GENERIC.KOI_BALANCE)
  }
  /**
   * 
   * @returns {String} 3 characters of currency. Example: 'USD'
   */
  async selectedCurrency() {
    return await this.#chrome._getChrome(GENERIC.SELECTED_CURRENCY)
  }
  /**
   * 
   * @returns {Array} Array of connected site origins.
   */
  async connectedSites() {
    return await this.#chrome._getChrome(GENERIC.CONNECTED_SITE)
  }
  /**
   * 
   * @returns {String} Name of this account.
   */
  async accountName() {
    return await this.#chrome._getChrome(GENERIC.ACCOUNT_NAME)
  }
  /**
   * 
   * @returns {String} Friend referral code
   */
  async affiliateCode() {
    return await this.#chrome._getChrome(GENERIC.AFFILIATE_CODE)
  }
  /**
   * 
   * @returns {Boolean} State of locked/unlocked
   */
  async unlocked() {
    return await this.#chrome._getChrome(GENERIC.UNLOCKED)
  }

  async nftBitData() {
    return await this.#chrome._getChrome(GENERIC.NFT_BIT_DATA)
  }

  async activityNotifications() {
    return await this.#chrome._getChrome(GENERIC.ACTIVITY_NOTIFICATIONS)
  }

  async tokenPrice() {
    return await this.#chrome._getChrome(GENERIC.TOKEN_PRICE)
  }

  async transactionData() {
    return await this.#chrome._getChrome(GENERIC.TRANSACTION_DATA) || []
  }

  async savedNFTForm() {
    return await this.#chrome._getChrome(GENERIC.SAVED_NFT_FORM) || {}
  }

  async addressBook() {
    return await this.#chrome._getChrome(GENERIC.ADDRESS_BOOK) || []
  }
}
