import { MESSAGES } from 'constants/koiConstants'

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
  removeWallet(body) {
    return this.promise(MESSAGES.REMOVE_WALLET, body)
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


  /**
   * 
   * @param {Object} body request body
   * @param {String} body.seedPhrase the generated seed phrase
   * @param {String} body.password input password
   * @returns {Object} koiData: { address }
   */
  saveWallet(body) {
    return this.promise(MESSAGES.SAVE_WALLET_GALLERY, body)
  }


  /**
   * 
   * @param {Object} body request body
   * @param {Number} body.qty quantity
   * @param {String} body.target target address
   * @param {String} body.token KOII or AR
   * @returns {Object} { txId, qty, address, currency }
   */
  makeTransfer(body) {
    return this.promise(MESSAGES.MAKE_TRANSFER, body)
  }


  /**
   * 
   * @param {Object} body request body
   * @param {String} body.password input password
   * @returns {Object} { key }
   */
  getKeyFile(body) {
    return this.promise(MESSAGES.GET_KEY_FILE, body)
  }

  /**
   * 
   * @returns {Object} wallet key
   */
  getWalletKey() {
    return this.promise(MESSAGES.GET_WALLET)
  }

  /**
   * 
   * @param {Object} body request body
   * @param {String} body.address address of an account
   * @returns 
   */
  changeAccountName(body) {
    return this.promise(MESSAGES.CHANGE_ACCOUNT_NAME, body)
  }

  getLockState() {
    return this.promise(MESSAGES.GET_LOCK_STATE)
  }

  generateWallet(body) {
    return this.promise(MESSAGES.GENERATE_WALLET, body)
  }

  handleExpiredTransaction(body) {
    return this.promise(MESSAGES.HANDLE_EXPIRED_TRANSACTION, body)
  }

  connect(body) {
    return this.promise(MESSAGES.HANDLE_CONNECT, body)
  }

  signTransaction(body) {
    return this.promise(MESSAGES.HANDLE_SIGN_TRANSACTION, body)
  }

  /**
   * 
   * @param {Object} body
   * @param {String} body.oldPassword
   * @param {String} body.newPassword
   * @returns 
   */
  updatePassword(body) {
    return this.promise(MESSAGES.UPDATE_PASSWORD, body)
  }

  loadBalanceAsync(body) {
    return this.promise(MESSAGES.LOAD_BALANCE_ASYNC, body)
  }

  sendCustomTokenEth(body) {
    return this.promise(MESSAGES.SEND_CUSTOM_TOKEN_ETH, body)
  }

  sendCustomTokenAr(body) {
    return this.promise(MESSAGES.SEND_CUSTOM_TOKEN_AR, body)
  }

  sendCustomTokenSol(body) {
    return this.promise(MESSAGES.SEND_CUSTOM_TOKEN_SOL, body)
  }

  /**
   * 
   * @param {Object} body
   * @param {String} body.password 
   * @returns 
   */
  verifyPassword(body) {
    return this.promise(MESSAGES.VERIFY_PASSWORD, body)
  }
}
