import { mnemonicToSeedSync } from 'bip39'
import { Keypair } from '@solana/web3.js'
import { derivePath } from 'ed25519-hd-key'

const DEFAULT_DERIVE_PATH = `m/44'/501'/0'`

const bufferToString = (buffer) => Buffer.from(buffer).toString('hex')

const deriveSeed = (seed) => derivePath(DEFAULT_DERIVE_PATH, seed).key

const solanaUtils = {
  loadWallet: async (mnemonic) => {
    const seed = mnemonicToSeedSync(mnemonic)
    const keypair = Keypair.fromSeed(deriveSeed(bufferToString(seed)))

    return keypair
  }
}

export default solanaUtils
