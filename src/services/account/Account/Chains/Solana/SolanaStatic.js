export class SolanaStatic {
  async loadWallet(sol, keyOrSeedphrase) {
    let type = 'seedphrase'
    await sol.importWallet(keyOrSeedphrase, type)

    return sol.address
  }
  async generateWallet(sol) {
    // TODO ThuanN: generate wallet, set key and address to sol, return seed phrase
    sol.key = 'example_key'
    sol.address = 'example_address'
    return 'decorate legal liberty spread walnut pond happy worth emerge miss inform whisper'
  }
}
