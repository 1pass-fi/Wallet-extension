import { Wallet } from '../../Wallet'
import { EthereumUtils } from './EthereumUtils'
import { Ethereum as _Ethereum } from 'background/eth'
import { EthereumMethod } from './EthereumMethod'

export class Ethereum extends Wallet {
  #eth
  constructor({ address, key }) {
    super(address)
    this.#eth = new _Ethereum()
    this.#eth.address = address
    this.#eth.wallet = key
    this.method = new EthereumMethod(this.#eth)
  }

  static utils = new EthereumUtils
}
