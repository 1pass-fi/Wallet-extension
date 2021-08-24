import Web3 from 'web3'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import hdkey from 'ethereumjs-wallet/dist/hdkey'
import Tx from 'ethereumjs-tx'

import { ETH_NETWORK_PROVIDER } from 'koiConstants'

export class Ethereum {
  #provider
  #web3
  constructor(provider) {
    this.#provider = provider || ETH_NETWORK_PROVIDER.MAINNET
    this.#web3 = new Web3(this.#provider)
    this.key = null
    this.address = null
  }

  createNewWallet() {
    const seedPhrase = this.#generateMnemonic()

    const createdWallet = this.#getWalletFromSeedPhrase(seedPhrase)
    this.key = createdWallet.privateKey
    this.address = createdWallet.address
    return seedPhrase
  }

  importWallet(payload, type) {
    let wallet
    if (type == 'key') {
      wallet = this.#web3.eth.accounts.privateKeyToAccount(payload.key)
    } else {
      wallet = this.#getWalletFromSeedPhrase(payload)
    }
    this.key = wallet.privateKey
    this.address = wallet.address

    return wallet
  }

  async getBalance() {
    return this.#web3.eth.getBalance(this.address)
  }

  async sendTransfer() {
    // const privateKey = Buffer.from(this.key, 'hex')
    // const rawTx = {
    //   from: this.address,
    //   to: '0x79F5BaBCD9c4Bd2F46f64Fec3733C231458e52e9',
    //   value: 1000000000000,
    // }
    // const tx = new Tx.Transaction(rawTx, {'chain':'ropsten'})
    // console.log('tx', tx)
    // tx.sign(privateKey)
    // console.log('signedtx', tx)
    // const serializedTx = tx.serialize()
    // console.log('serializedtx', serializedTx)
    // return await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))


    const payload = {
      from: '0xb350522E17Bb34930022e61C7D7A13fef0394128',
      to: '0x79F5BaBCD9c4Bd2F46f64Fec3733C231458e52e9',
      value: '1000000000',
      gas: '2000000000000',
      chain: 'ropsten',
      hardfork: 'dao'
    }

    // var rawTx = {
    //   nonce: '0x00',
    //   gasPrice: '0x09184e72a000',
    //   gasLimit: '0x2710',
    //   to: '0x79F5BaBCD9c4Bd2F46f64Fec3733C231458e52e9',
    //   value: '0x00',
    //   data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
    // }

    const tx = await this.#web3.eth.accounts.signTransaction(payload, this.wallet)
    console.log('tx', tx)
    console.log('raw-tx', tx.rawTransaction)
    return await this.#web3.eth.sendSignedTransaction((tx.rawTransaction))
  }

  /*
    PRIVATE FUNCTIONS
  */
 
  #getWalletFromSeedPhrase(seedPhrase) {
    const seed = mnemonicToSeedSync(seedPhrase)
    const hdwallet = hdkey.fromMasterSeed(seed)
    const wallet_hdpath = 'm/44\'/60\'/0\'/0/0'

    const wallet = hdwallet.derivePath(wallet_hdpath).getWallet()
    const address = '0x' + wallet.getAddress().toString('hex')
    console.log('address: ', address)

    const privateKey = wallet.getPrivateKey().toString('hex')
    const restoredWallet = this.#web3.eth.accounts.privateKeyToAccount(privateKey)

    return restoredWallet
  }

  #generateMnemonic() {
    return generateMnemonic()
  }
}

export default new Ethereum()
