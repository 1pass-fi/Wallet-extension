export class SolanaStatic {
  async loadWallet(sol, keyOrSeedphrase) {
    let type = 'seedphrase'
    await sol.importWallet(keyOrSeedphrase, type)

    return sol.address
  }
  async generateWallet(sol, key) {
    return ''
  }
}
