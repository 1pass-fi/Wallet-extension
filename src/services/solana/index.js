import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import { Keypair } from '@solana/web3.js'
import { derivePath } from 'ed25519-hd-key'

export class SolanaTool {
  constructor() {
    this.key = null
    this.address = null
  }

  importWallet(key, type) {
    let wallet

    const DEFAULT_DERIVE_PATH = `m/44'/501'/0'`
    const bufferToString = (buffer) => Buffer.from(buffer).toString('hex')
    const deriveSeed = (seed) => derivePath(DEFAULT_DERIVE_PATH, seed).key

    const seed = mnemonicToSeedSync(key)
    const keypair = Keypair.fromSeed(deriveSeed(bufferToString(seed)))

    this.address = keypair.publicKey.toString()
    this.key = keypair.secretKey.toString()

    wallet = {
      address: this.address,
      privateKey: this.key
    }

    return wallet
  }

  generateWallet() {
    const seedPhrase = generateMnemonic()

    this.importWallet(seedPhrase)

    return seedPhrase
  }
}
