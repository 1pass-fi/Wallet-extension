import { AccountStorageUtils } from 'services/account/AccountStorageUtils'

export class K2Method
{
  #chrome
  constructor(k2) {
    this.k2 = k2
    this.#chrome = new AccountStorageUtils(k2.address)
  }
  
  async getBalances() {}

  async loadMyContent() {}

  async updateActivities() {}

  async transfer() {}

  async loadCollections() {}
}
