import { Wallet } from './Wallet'
import { EthereumUtils } from './EthereumUtils'

export class Ethereum extends Wallet {
  constructor(address) {
    super(address)
  }

  static utils = new EthereumUtils
}
