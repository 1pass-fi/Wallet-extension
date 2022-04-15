/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {
  PATH,
  ALL_NFT_LOADED,
  ACTIVITY_NAME,
  ETHERSCAN_API,
  ETH_NFT_BRIDGE_ACTION
} from 'constants/koiConstants'
import { ACCOUNT } from 'constants/accountConstants'
import { getChromeStorage } from 'utils'
import { get, includes, findIndex } from 'lodash'
import moment from 'moment'

import { TYPE } from 'constants/accountConstants'

import { AccountStorageUtils } from 'services/account/AccountStorageUtils'
import storage from 'services/storage'

export class SolanaMethod {
  #chrome
  constructor(eth) {
    this.eth = eth
    this.#chrome = new AccountStorageUtils(eth.address)
  }

  async getBalances() {
    const balance = Web3.utils.fromWei(await this.eth.getBalance())
    const koiBalance = 100
    return { balance, koiBalance }
  }

  async loadMyContent() {}

  async updateActivities() {}

  async transfer(_, recipient, qty) {}

  async loadCollections() {}

  async nftBridge({
    txId,
    toAddress,
    type = TYPE.ARWEAVE,
    tokenAddress,
    tokenSchema,
    accountName
  }) {}

  async #bridgeEthtoAr({ txId: tokenId, toAddress, tokenAddress, tokenSchema }) {}

  async transactionConfirmedStatus(txHash) {}

  async getNftData(contents, getBase64) {}

  async getBridgeStatus(txId) {}

  async resendTransaction(txId) {}

  async getNetworkId() {}

  async transferToken({ tokenContractAddress, to, value }) {}
}
