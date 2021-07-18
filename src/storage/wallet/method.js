import { WalletChromeStorage } from '../ChromeStorage'
import { WALLET } from '../storageConstants'
import passworder from 'browser-passworder'

export class WalletMethod {
  #wallet
  #network
  constructor(network) {
    this.#network = network
    this.#wallet = new WalletChromeStorage(this.#network)
  }

  async saveWallet(password, koi) {
    // encrypt key with password
    const encryptedKey = await passworder.encrypt(password, koi.wallet)
    console.log('encryptedKey', encryptedKey)
    console.log(this.#wallet._getKeyWord(WALLET.ADDRESS))
    // set address, key
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.ADDRESS), koi.address)
    await this.#wallet._setChrome(this.#wallet._getKeyWord(WALLET.KEY), encryptedKey)
  }

  async removeWallet() {
    console.log('key')
  }
  
  async decryptWalletKey(password) {
    try {
      const encryptedKey = await this.#wallet._getChrome(this.#wallet._getKeyWord(WALLET.KEY))
      console.log(encryptedKey)
      const decryptedKey = await passworder.decrypt(password, encryptedKey)
      return decryptedKey
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
