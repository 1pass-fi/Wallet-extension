import { WalletGet } from './get'
import { WalletSet } from './set'
import { WalletRemove } from './remove'
import { WalletMethod } from './method'

export class Wallet {
  #network
  constructor(network) {
    this.#network = network
    this.get = new WalletGet(this.#network)
    this.set = new WalletSet(this.#network)
    this.remove = new WalletRemove(this.#network)
    this.method = new WalletMethod(this.#network)
  }
}
