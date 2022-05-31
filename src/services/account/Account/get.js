import { AccountStorageUtils } from '../AccountStorageUtils'
import { ACCOUNT } from 'constants/accountConstants'

export class AccountGetter {
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
  async address() {
    return this.#accountStorage.getField(ACCOUNT.ADDRESS)
  }
  /**
     * 
     * @returns {JSON} Encrypted Keyfile JSON
     */
  async key() {
    return await this.#accountStorage.getField(ACCOUNT.KEY)
  }
  /**
     * 
     * @returns {JSON} Encrypted Seed phrase JSON
     */
  async seedPhrase() {
    return await this.#accountStorage.getField(ACCOUNT.SEED_PHRASE)
  }
  /**
     * 
     * @returns {Number} Total Balance
     */
  async balance() {
    return await this.#accountStorage.getField(ACCOUNT.BAlANCE)
  }

  async koiBalance() {
    return await this.#accountStorage.getField(ACCOUNT.KOI_BALANCE)
  }
  /**
     * Because assets will take many time to load, we will save assets seperately
     * @returns {Array} List of NFTs
     */
  async assets() {
    return await this.#accountStorage.getAssets() || []
  }

  /**
     * 
     * @returns {Number} Price of token
     */
  async price() {
    return await this.#accountStorage.getField(ACCOUNT.PRICE)
  }
  /**
     * 
     * @returns {Array} List of pending transacitons
     */
  async pendingTransactions() {
    return await this.#accountStorage.getField(ACCOUNT.PENDING_TRANSACTION) || []
  }
  /**
     * 
     * @returns {String} Account name for the wallet.
     */
  async accountName() {
    return await this.#accountStorage.getField(ACCOUNT.ACCOUNT_NAME)
  }
  /**
     * 
     * @returns {Array} list of collections
     */
  async collections() {
    return await this.#accountStorage.getCollections()
  }

  async collectionNfts() {
    return await this.#accountStorage.getCollectionNfts()
  }

  async type() {
    return await this.#accountStorage.getField(ACCOUNT.TYPE)
  }

  async encryptedKey() {
    return await this.#accountStorage.getField(ACCOUNT.ENCRYPTED_KEY)
  }

  async kid() {
    return await this.#accountStorage.getKID()
  }

  async pendingConfirmationTransaction() {
    return await this.#accountStorage.getField(ACCOUNT.PENDING_CONFIRMATION_TRANSACTION)
  }

  async pendingAssets() {
    return await this.#accountStorage.getPendingAssets() || []
  }

  async metadata() {
    const type = await this.type()
    const address = await this.address()
    const accountName = await this.accountName()
    const balance = await this.balance()
    const koiBalance = await this.koiBalance()
    const provider = await this.provider()
    const seedPhrase = await this.seedPhrase()
    const affiliateCode = await this.affiliateCode()
    const inviteSpent = await this.inviteSpent()
    const totalReward = await this.totalReward()
    const didData = await this.didData()
    const totalAssets = await this.assets()

    return { 
      address, 
      balance, 
      koiBalance, 
      accountName, 
      type, 
      provider, 
      seedPhrase,
      affiliateCode,
      inviteSpent,
      totalReward,
      didData,
      totalAssets
    }
  }

  async conectedSite() {
    return await this.#accountStorage.getField(ACCOUNT.CONNECTED_SITE)
  }

  async provider() {
    return await this.#accountStorage.getField(ACCOUNT.PROVIDER)
  }

  async activities() {
    return await this.#accountStorage.getActivities() || []
  }

  async affiliateCode() {
    return await this.#accountStorage.getField(ACCOUNT.AFFILIATE_CODE) || ''
  }

  async inviteSpent() {
    return await this.#accountStorage.getField(ACCOUNT.INVITE_SPENT)
  }

  async totalReward() {
    return await this.#accountStorage.getField(ACCOUNT.TOTAL_REWARD)
  }

  async didData() {
    return await this.#accountStorage.getField(ACCOUNT.DID_DATA) || {}
  }
}
