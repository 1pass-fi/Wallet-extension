import { generateMnemonic, mnemonicToSeedSync } from 'bip39'
import {
  Keypair,
  Connection,
  clusterApiUrl,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from '@solana/web3.js'
import { derivePath } from 'ed25519-hd-key'
import isEmpty from 'lodash/isEmpty'

export class SolanaTool {
  constructor(credentials, provider) {
    this.key = null
    this.address = null
    this.keypair = null

    if (!isEmpty(credentials)) {
      this.key = credentials.key
      this.address = credentials.address
      this.keypair = Keypair.fromSecretKey(new Uint8Array(credentials.key.split(',')))
    }

    this.provider = provider || 'testnet'
    this.connection = new Connection(clusterApiUrl(provider), 'confirmed')
  }

  getCurrentNetwork() {
    return this.provider
  }

  importWallet(key, type) {
    let wallet

    const DEFAULT_DERIVE_PATH = `m/44'/501'/0'`
    const bufferToString = (buffer) => Buffer.from(buffer).toString('hex')
    const deriveSeed = (seed) => derivePath(DEFAULT_DERIVE_PATH, seed).key

    const seed = mnemonicToSeedSync(key)
    const keypair = Keypair.fromSeed(deriveSeed(bufferToString(seed)))

    this.keypair = keypair
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

  async getBalance() {
    const balance = await this.connection.getBalance(this.keypair.publicKey)

    return balance
  }

  async transfer(recipient, amount) {
    const transaction = new Transaction()

    transaction.add(
      SystemProgram.transfer({
        fromPubkey: this.keypair.publicKey,
        toPubkey: new PublicKey(recipient),
        lamports: amount * LAMPORTS_PER_SOL
      })
    )

    const receipt = await sendAndConfirmTransaction(this.connection, transaction, [this.keypair])

    return receipt
  }
}
