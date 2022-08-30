import { Web } from '@_koi/sdk/web'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import hdkey from 'ethereumjs-wallet/dist/hdkey'
import Web3 from 'web3'

export class EthereumTool {
  #provider
  #web3
  constructor(provider) {
    this.#provider = provider || ETH_NETWORK_PROVIDER.MAINNET
    this.#web3 = new Web3(this.#provider)
    this.key = null
    this.address = null
  }

  web3() {
    return this.#web3
  }

  getCurrentNetWork() {
    return this.#provider
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
    if (type === 'key') {
      wallet = this.#web3.eth.accounts.privateKeyToAccount(payload)
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

  async transferEth(toAddress, amount) {
    const koiTools = new Web()
    koiTools.initializeEthWalletAndProvider(this.address, this.#provider)

    const receipt = await koiTools.transferEth(toAddress, amount, this.key)
    return receipt
  }

  async getTransactionStatus(txHash) {
    return this.#web3.eth.getTransactionReceipt(txHash)
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

export default new EthereumTool()
