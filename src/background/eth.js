import Web3 from 'web3'
import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import hdkey from 'ethereumjs-wallet/dist/hdkey'

class Ethereum {
  #provider
  #web3
  constructor() {
    this.#provider = 'https://ropsten.infura.io/v3/a14cb094aac040be922807d25abd33f1'
    this.#web3 = new Web3(this.#provider)
    this.key = null
    this.address = null
  }

  createNewWallet() {
    const seedPhrase = this.#generateMnemonic()

    const createdWallet = this.#getWalletFromSeedPhrase(seedPhrase)
    this.key = createdWallet.privateKey
    this.address = createdWallet.address
    return { seedPhrase, wallet: createdWallet}
  }

  importWallet(payload, type) {
    let wallet
    if (type == 'key') {
      wallet = this.#web3.eth.accounts.privateKeyToAccount(payload.key)
    }
    wallet = this.#getWalletFromSeedPhrase(payload)
    this.key = wallet.privateKey
    this.address = wallet.address

    return wallet
  }

  async getBalance() {
    return this.#web3.eth.getBalance(this.address)
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
