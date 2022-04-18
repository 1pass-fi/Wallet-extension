import { AccountStorageUtils } from 'services/account/AccountStorageUtils'

export class SolanaMethod {
  #chrome
  constructor(eth) {
    this.eth = eth
    this.#chrome = new AccountStorageUtils(eth.address)
  }

  async getBalances() {
    return { balance: 10 }
  }

  async loadMyContent() {
    const res = {
      contents: [],
      newContents: []
    }

    return res
  }

  async updateActivities() {
    this.#chrome.setActivities([])
  }

  async transfer(_, recipient, qty) {
    return 'example_txid'
  }

  async loadCollections() {}

  async transactionConfirmedStatus(txHash) {}

  async getNftData() {
    return []
  }

  async resendTransaction(txId) {}
}
