import { Keypair } from '@_koi/web3.js'
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

      return k2.address
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async loadWalletFromJson(jsonKey) {
    try {
      const keypair = Keypair.fromSecretKey(Buffer.from(jsonKey, 'base64'))

      return { key: keypair.secretKey.toString(), address: keypair.publicKey.toString() }
    } catch (err) {
      console.error(err)
      throw new Error('load wallet failed')
    }
  }

  async generateWallet(k2) {
    const seedPhrase = await k2.generateWallet()

    return seedPhrase
  }
}
