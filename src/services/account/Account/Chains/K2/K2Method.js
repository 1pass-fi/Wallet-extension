import { AccountStorageUtils } from 'services/account/AccountStorageUtils'

export class K2Method {
  #chrome
  constructor(k2Tool) {
    this.k2Tool = k2Tool
    this.#chrome = new AccountStorageUtils(k2Tool.address)
  }

  async getBalances() {
    console.log('this.k2Tool================', this.k2Tool)
    const k2Balance = await this.k2Tool.getBalance()
    console.log('k2Balance================', k2Balance)
    return { balance: 1000000000 }
  }

  async loadMyContent() {
    return []
  }

  async updateActivities() {
    console.log('updateActivities-boilerplate')
  }

  async transfer(_, recipient, qty) {
    console.log('transfer-boilerplate')
    // return this.k2Tool.transfer(recipient, qty)
  }

  async loadCollections() {}

  async createCollection() {}

  async loadKID() {}

  async createOrUpdateKID() {}

  async transactionConfirmedStatus(txHas) {
    return { dropped: false, confirmed: true }
  }

  async nftBridge() {}

  async getBridgeStatus() {}

  /* */

  async signTx() {}

  async registerData() {}

  async signPort() {}

  async transferNFT() {}

  async updateNftStates() {}

  async registerNft() {}

  /*
    AFFILIATE CODE
  */
  async getAffiliateCode() {}

  async claimReward() {}

  async getRegistrationReward() {}

  async submitInviteCode() {}

  async getTotalRewardK2() {}

  async checkAffiliateInviteSpent() {}

  /*
    GET DATA FOR INPUT nftIds
  */
  async getNftData(nftIds, getBase64) {}

  /* */
  async getNfts(nftIds, getBase64) {}
}
