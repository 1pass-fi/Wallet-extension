import { isString } from 'lodash'

export class EthereumStatic {

  async loadWallet (eth, key) {
    try {
      let type

      if (!isString(key)) throw new Error('Invalid Key or Seed phrase.')

      const words = key.split(' ')

      if (!(words.length === 1 || words.length === 12)) throw new Error('Invalid Key or Seed phrase.')

      if (words.length === 12) {
        type = 'seedphrase'        
      } else {
        type = 'key'
      }

      await eth.importWallet(key, type)

      return eth.address
  
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async generateWallet(eth) {
    return eth.createNewWallet()
  }
}
