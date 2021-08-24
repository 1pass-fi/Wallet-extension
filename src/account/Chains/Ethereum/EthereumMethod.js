/* 
  Arweave method is functions to use when we have address and key of a wallet.
  Load activities, assets,...
*/

import {PATH, ALL_NFT_LOADED } from 'koiConstants'
import { getChromeStorage } from 'utils'
import { get, isNumber, isArray } from 'lodash'
import moment from 'moment'

import axios from 'axios'

import web3 from 'web3'

export class EthereumMethod {
  constructor(eth) {
    this.eth = eth
  }

  async getBalances() {
    const balance = web3.utils.fromWei(await this.eth.getBalance())
    const koiBalance = 100
    return { balance, koiBalance }
  }

  async loadMyContent() {

  }

  async loadMyActivities (cursor) {
    return {activitiesList: [
      {id: '1', activityName: 'Sent ETH', expense: 0.32, accountName: 'Account 1', date: 'July 20 2021', source:'0x1234567890'}
    ]}
  }

  async transfer() {
    try {
      console.log('ETH send transfer result', await this.eth.sendTransfer())
    } catch (err) {
      console.log('SEND TRANSACTION ERRROR', err.message)
    }
  }
}
