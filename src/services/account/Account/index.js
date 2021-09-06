import { AccountGetter } from './get'
import { AccountSetter } from './set'

import { Web } from '@_koi/sdk/web'
import { Ethereum } from 'background/eth'

import { ArweaveMethod } from './Chains/Arweave/ArweaveMethod'
import { ArweaveStatic } from './Chains/Arweave/ArweaveStatic'
import { EthereumMethod } from './Chains/Ethereum/EthereumMethod'
import { EthereumStatic } from './Chains/Ethereum/EthereumStatics'

export class Account {
  constructor(address) {
    this.get = new AccountGetter(address)
  }
}

export class BackgroundAccount extends Account {
  constructor(address) {
    super(address)
    this.set = new AccountSetter(address)
  }
}

export class ArweaveAccount extends BackgroundAccount {
  #koi
  constructor({ address, key }) {
    super(address)
    this.#koi = new Web()
    this.#koi.address = address
    this.#koi.wallet = key
    this.method = new ArweaveMethod(this.#koi)
  }

  static utils = new ArweaveStatic()
}

export class EthereumAccount extends BackgroundAccount {
  #eth
  constructor({ address, key }, provider) {
    super(address)
    this.#eth = new Ethereum(provider)
    this.#eth.address = address
    this.#eth.provider = provider
    this.#eth.wallet = key.key
    this.method = new EthereumMethod(this.#eth)
  }

  static utils = new EthereumStatic()
}