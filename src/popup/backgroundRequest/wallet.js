import { MESSAGES } from 'koiConstants'

import { Request } from './request'

export class WalletRequest extends Request {
  constructor(backgroundConnect) {
    super(backgroundConnect)
  }
  /**
   * 
   * @param {Object} body request body
   * @param {Object} body.key wallet key
   * @param {String} body.password input password
   * @returns {Object} koiData: { address }
   */
  importWallet(body) {
    return this.promise(MESSAGES.IMPORT_WALLET, body)
  }

  /**
   * 
   * @param {Object} body request body
   * @param {String} body.address wallet address
   * @returns {Object} koiData: { address }
   */
  loadWallet(body) {
    return this.promise(MESSAGES.LOAD_WALLET, body)
  }

  /**
   * 
   * @returns {Object} koiData: { arBalance: null, koiBalance: null, address: null }
   */
  removeWallet() {
    return this.promise(MESSAGES.REMOVE_WALLET)
  }

  /**
   * 
   * @returns {Object} koiData: { arBalance: null, koiBalance: null, address: null }
   */
  lockWallet() {
    return this.promise(MESSAGES.LOCK_WALLET)
  }

  /**
   * 
   * @param {Object} body request body
   * @param {String} body.password input password
   * @returns {Object} koiData: { address }
   */
  unlockWallet(body) {
    return this.promise(MESSAGES.UNLOCK_WALLET, body)
  }
}
