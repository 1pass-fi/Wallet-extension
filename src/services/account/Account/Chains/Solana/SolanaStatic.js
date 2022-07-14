import { isString } from 'lodash'

export class SolanaStatic {
  async loadWallet(sol, key) {
    try {
      let type

      if (!isString(key)) throw new Error('Invalid Key or Seed phrase.')

      const words = key.split(' ')

      if (!(words.length === 1 || words.length === 12))
        throw new Error('Invalid Key or Seed phrase.')

      if (words.length === 12) {
        type = 'seedphrase'
      } else {
        type = 'key'
      }

      await sol.importWallet(key, type)

      return sol.address
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async generateWallet(sol) {
    const seedPhrase = await sol.generateWallet()

    return seedPhrase
  }
}
