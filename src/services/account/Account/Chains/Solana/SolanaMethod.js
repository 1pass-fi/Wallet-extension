import { AccountStorageUtils } from 'services/account/AccountStorageUtils'

export class SolanaMethod {
  #chrome
  constructor(solTool) {
    this.solTool = solTool
    this.#chrome = new AccountStorageUtils(solTool.address)
  }

  async getBalances() {
    const solBalance = await this.solTool.getBalance()
    return { balance: solBalance }
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
