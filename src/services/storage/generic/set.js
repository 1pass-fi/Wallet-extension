import { ChromeStorage } from '../ChromeStorage'
import { GENERIC } from 'constants/storageConstants'

export class GenericSet {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }
  /**
   * 
   * @param {Object} value Pending request payload
   * @param {String} value.type Type of pending transaction
   * @param {Object} value.data Data of pending transaction 
   * @returns 
   */
  pendingRequest(value) {
    return this.#chrome._setChrome(GENERIC.PENDING_REQUEST, value)
  }
  /**
   * 
   * @param {Number} value Total Koi balance
   * @returns 
   */
  koiBalance(value) {
    return this.#chrome._setChrome(GENERIC.KOI_BALANCE, value)
  }
  /**
   * 
   * @param {String} value Selected currency, choosen in setting.
   * @returns 
   */
  selectedCurrency(value) {
    return this.#chrome._setChrome(GENERIC.SELECTED_CURRENCY, value)
  }
  /**
   * 
   * @param {Array} value Array of connected sites 
   * @returns 
   */
  connectedSite(value) {
    return this.#chrome._setChrome(GENERIC.CONNECTED_SITE, value)
  }
  /**
   * 
   * @param {String} value Name for this account
   * @returns 
   */
  accountName(value) {
    return this.#chrome._setChrome(GENERIC.ACCOUNT_NAME, value)
  }
  /**
   * 
   * @param {String} value Friend referral code.
   * @returns 
   */
  affiliateCode(value) {
    return this.#chrome._setChrome(GENERIC.AFFILIATE_CODE, value)
  }
  /**
   * 
   * @param {Bolean} value State of locked/unlocked
   * @returns 
   */
  unlocked(value) {
    return this.#chrome._setChrome(GENERIC.UNLOCKED, value)
  }

  /**
   * 
   * @param {Array} 8 bit array
   * @returns 
   */
  nftBitData(value) {
    return this.#chrome._setChrome(GENERIC.NFT_BIT_DATA, value)
  }

  activityNotifications(value) {
    return this.#chrome._setChrome(GENERIC.ACTIVITY_NOTIFICATIONS, value)
  }

  tokenPrice(value) {
    return this.#chrome._setChrome(GENERIC.TOKEN_PRICE, value)
  }

  transactionData(value) {
    return this.#chrome._setChrome(GENERIC.TRANSACTION_DATA, value)
  }
}
