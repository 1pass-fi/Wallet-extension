import { isString } from 'lodash'

export class EthereumUtils {

  async loadWallet (eth, key) {
    try {
      if (isString(key)) {
        await eth.importWallet(key, 'seedPhrase')
      } else {
        await eth.importWallet(key, 'key')
      }

      return eth.address
  
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
