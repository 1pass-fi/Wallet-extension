import { isString } from 'lodash'
export class K2Static {
  async loadWallet(k2, keyOrSeedphrase) {
    try {
      let type

      if (!isString(keyOrSeedphrase)) throw new Error('Invalid Key or Seed phrase.')

      const words = keyOrSeedphrase.split(' ')

      if (!(words.length === 1 || words.length === 12))
        throw new Error('Invalid Key or Seed phrase.')

      if (words.length === 12) {
        type = 'seedphrase'
      } else {
        type = 'key'
      }

      await k2.importWallet(keyOrSeedphrase, type)

      // TODO testing DatH - LongP
      console.log('loadWallet k2', k2)

      return k2.address
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async generateWallet(k2) {
    const seedPhrase = k2.generateWallet()

    return seedPhrase
  }
}
