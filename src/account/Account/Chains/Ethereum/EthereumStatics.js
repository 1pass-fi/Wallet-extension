import { isString } from 'lodash'

export class EthereumStatic {

  async loadWallet (eth, key) {
    try {
      if (isString(key)) {
        await eth.importWallet(key, 'seedPhrase')
      } else {
        await eth.importWallet(key, 'key')
      }

      console.log('eth data', eth.key, eth.address)
      return eth.address
  
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async generateWallet(eth) {
    return eth.createNewWallet()
  }
}
