import { Wallet } from './Wallet'
import { ArweaveUtils } from './ArweaveUtils'
import { ArweaveMethod } from './ArweaveMethod'

import { Web } from '@_koi/sdk/web'

export class Arweave extends Wallet {
  #koi
  constructor({ address, key }) {
    super(address)
    this.#koi = new Web()
    this.#koi.address = address
    this.#koi.wallet = key
    this.method = new ArweaveMethod(this.#koi)
  }

  // Replace functions for utils/index
  static utils = new ArweaveUtils()
}
