// import Web3 from 'web3'
import { Web } from '@_koi/sdk/web'
// import { clarifyEthereumProvider } from 'constants/koiConstants'
// import { clarifyEthereumProvider } from 'utils'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { ETH_NETWORK_PROVIDER } from 'constants/koiConstants'
import hdkey from 'ethereumjs-wallet/dist/hdkey'
import { ethers } from 'ethers'

export class EthereumTool {
  #provider
  #web3
  constructor(provider) {
    this.#provider = provider || ETH_NETWORK_PROVIDER.MAINNET

    const clarifyEthereumProvider = (ethProvider) => {
      try {
        let ethNetwork, apiKey
        const providerArray = ethProvider.split('/')
        apiKey = providerArray[4]
        ethNetwork = providerArray[2].split('.')[0]
        return { ethNetwork, apiKey }
      } catch (err) {
        console.error('Failed to clarify Ethereum Provider - error: ', err.message)
        return { ethNetwork: 'mainnet', apiKey: 'f811f2257c4a4cceba5ab9044a1f03d2' }
      }
    }

    const { ethNetwork, apiKey } = clarifyEthereumProvider(this.#provider)

    const network = ethers.providers.getNetwork(ethNetwork)

    this.#web3 = new ethers.providers.InfuraProvider(network, apiKey)

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
      // wallet = this.#web3.eth.accounts.privateKeyToAccount(payload)
      wallet = new ethers.Wallet(payload, this.#web3)
    } else {
      wallet = this.#getWalletFromSeedPhrase(payload)
    }
    this.key = wallet.privateKey
    this.address = wallet.address

    return wallet
  }

  async getBalance() {
    // return this.#web3.eth.getBalance(this.address)
    return this.#web3.getBalance(this.address)
  }

  async transferEth(toAddress, amount) {
    const koiTools = new Web()
    koiTools.initializeEvmWalletAndProvider(this.address, this.#provider)

    const receipt = await koiTools.transferEvm(toAddress, amount, this.key)
    return receipt
  }

  async getTransactionStatus(txHash) {
    // return this.#web3.eth.getTransactionReceipt(txHash)
    return this.#web3.getTransactionReceipt(txHash)
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
    // const restoredWallet = this.#web3.eth.accounts.privateKeyToAccount(privateKey)
    const restoredWallet = new ethers.Wallet(privateKey, this.#web3)

    return restoredWallet
  }

  #generateMnemonic() {
    return generateMnemonic()
  }
}

export default new EthereumTool()
