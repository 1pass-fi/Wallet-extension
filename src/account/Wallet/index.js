import { WalletGet } from './get'
import { WalletSet } from './set'

export class Wallet {
  #address
  constructor(address) {
    this.#address = address
    this.get = new WalletGet(this.#address)
    this.set = new WalletSet(this.#address)
  }
}
