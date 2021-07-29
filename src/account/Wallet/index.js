import { WalletGet } from './get'
import { WalletSet } from './set'

export class Wallet {
  constructor(address) {
    this.get = new WalletGet(address)
    this.set = new WalletSet(address)
  }
}

export class WalletPopup {
  constructor(address) {
    this.get = new WalletGet(address)
  }
}
