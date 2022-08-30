import { ACCOUNT } from 'constants/accountConstants'

import { AccountStorageUtils } from '../AccountStorageUtils'

export class AccountSetter {
  #address
  #accountStorage
  constructor(address) {
    this.#address = address
    this.#accountStorage = new AccountStorageUtils(this.#address)
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
    return await this.#accountStorage.setCollections(value)
  }

  async collectionNfts(value) {
    return await this.#accountStorage.setCollectionNfts(value)
  }

  async kid(value) {
    return await this.#accountStorage.setKID(value)
  }

  async pendingConfirmationTransaction(value) {
    return await this.#accountStorage.setField(ACCOUNT.PENDING_CONFIRMATION_TRANSACTION, value)
  }

  async addPendingConfirmationTransaction(value) {
    const transactions = await this.#accountStorage.getField(ACCOUNT.PENDING_CONFIRMATION_TRANSACTION) || []
    transactions.unshift(value)
    await this.#accountStorage.setField(ACCOUNT.PENDING_CONFIRMATION_TRANSACTION, transactions)
  }

  async pendingAssets(value) {
    await this.#accountStorage.setPendingAssets(value)
  }

  async connectedSite(value) {
    await this.#accountStorage.setField(ACCOUNT.CONNECTED_SITE, value)
  }

  async provider(value) {
    await this.#accountStorage.setField(ACCOUNT.PROVIDER, value)
  }

  async activities(value) {
    await this.#accountStorage.setActivities(value)
  }

  async affiliateCode(value) {
    return await this.#accountStorage.setField(ACCOUNT.AFFILIATE_CODE, value)
  }

  async inviteSpent(value) {
    return await this.#accountStorage.setField(ACCOUNT.INVITE_SPENT, value)
  }

  async totalReward(value) {
    return await this.#accountStorage.setField(ACCOUNT.TOTAL_REWARD, value)
  }

  async didData(value) {
    return await this.#accountStorage.setField(ACCOUNT.DID_DATA, value)
  }
}
