// import { Web } from '@_koi/sdk/web'
const Web = () => ({})
import { EthereumTool } from 'services/ethereum'
import { K2Tool } from 'services/k2'
import { SolanaTool } from 'services/solana'

import { ArweaveMethod } from './Chains/Arweave/ArweaveMethod'
import { ArweaveStatic } from './Chains/Arweave/ArweaveStatic'
import { EthereumMethod } from './Chains/Ethereum/EthereumMethod'
import { EthereumStatic } from './Chains/Ethereum/EthereumStatics'
import { K2Method } from './Chains/K2/K2Method'
import { K2Static } from './Chains/K2/K2Static'
import { SolanaMethod } from './Chains/Solana/SolanaMethod'
import { SolanaStatic } from './Chains/Solana/SolanaStatic'
import { AccountGetter } from './get'
import { AccountSetter } from './set'

export class Account {
  constructor(address) {
    this.get = new AccountGetter(address)
    this.set = new AccountSetter(address)
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

  getKey() {
    return this.#koi.wallet
  }

  static utils = new ArweaveStatic()
}

export class EthereumAccount extends BackgroundAccount {
  #eth
  constructor({ address, key }, provider) {
    super(address)
    this.#eth = new EthereumTool(provider)
    this.#eth.address = address
    this.#eth.provider = provider
    this.#eth.key = key
    this.method = new EthereumMethod(this.#eth)
  }

  static utils = new EthereumStatic()
}

export class SolanaAccount extends BackgroundAccount {
  #solTool
  constructor({ address, key }, provider) {
    super(address)
    this.#solTool = new SolanaTool({ address, key }, provider)

    this.method = new SolanaMethod(this.#solTool)
  }

  static utils = new SolanaStatic()
}

export class K2Account extends BackgroundAccount {
  #k2Tool
  constructor({ address, key }, provider) {
    super(address)
    this.#k2Tool = new K2Tool({ address, key }, provider)

    this.method = new K2Method(this.#k2Tool)
  }

  static utils = new K2Static()
}
