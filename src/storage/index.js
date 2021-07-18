import { Wallet } from './wallet'
import { NETWORK } from './storageConstants'
import { Generic } from './generic'

class Storage {
  constructor() {
    this.arweaveWallet = new Wallet(NETWORK.ARWEAVE)
    this.ethereumWallet = new Wallet(NETWORK.ETHEREUM)
    this.generic = new Generic()
  }
}

export default new Storage()
