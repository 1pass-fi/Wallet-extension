import { AccountStorageUtils } from 'services/account/AccountStorageUtils'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import moment from 'moment'

import { ACCOUNT } from 'constants/accountConstants'

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
    const connection = new Connection(clusterApiUrl(this.solTool.provider))
  
    const signatureInfos = await connection.getSignaturesForAddress(this.solTool.keypair.publicKey)

    const transactions = await Promise.all(
      signatureInfos.map(
        async (signatureInfos) => await connection.getTransaction(signatureInfos.signature)
      )
    )

    const accountName = await this.#chrome.getField(ACCOUNT.ACCOUNT_NAME)

    const activities = transactions.map((tx) => {
      const { transaction } = tx

      let source, activityName, expense

      if (transaction.message.accountKeys[0]?.toString() === this.solTool.address) {
        source = transaction.message.accountKeys[1]?.toString()
        activityName = 'Sent SOL'
        expense = Math.abs(tx.meta.postBalances[0] - tx.meta.preBalances[0]) / LAMPORTS_PER_SOL
      } else {
        source = transaction.message.accountKeys[0]?.toString()
        activityName = 'Received SOL'
        expense = Math.abs(tx.meta.postBalances[1] - tx.meta.preBalances[1]) / LAMPORTS_PER_SOL
      }

      return {
        id: transaction.signatures[0],
        activityName,
        expense,
        accountName,
        time: tx.blockTime,
        date: moment(Number(tx.blockTime) * 1000).format('MMMM DD YYYY'),
        source,
        network: this.solTool.provider,
        address: this.solTool.address
      }
    })
  }

  async transfer(_, recipient, qty) {
    return this.solTool.transfer(recipient, qty)
  }

  async loadCollections() {}

  async transactionConfirmedStatus(txHash) {
    /* TODO Minh Vu */
    return { dropped: false, confirmed: true }
  }

  async getNftData() {
    return []
  }

  async resendTransaction(txId) {}
}
