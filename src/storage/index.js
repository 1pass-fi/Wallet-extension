import { Wallet } from './wallet'
import { NETWORK } from './storageConstants'
import { Generic } from './generic'
import { Setting } from './settings'

class Storage {
  constructor() {
    this.arweaveWallet = new Wallet(NETWORK.ARWEAVE)
    this.ethereumWallet = new Wallet(NETWORK.ETHEREUM)
    this.generic = new Generic()
    this.setting = new Setting()
  }
}

export default new Storage()
