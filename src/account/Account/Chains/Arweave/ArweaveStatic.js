export class ArweaveStatic {

  async loadWallet(koiObj, key) {
    try {
      await koiObj.loadWallet(key)
  
      return koiObj.address
  
    } catch (err) {
      throw new Error(err.message)
    }
  }

  async generateWallet(koiObj) {
    try {
      await koiObj.generateWallet(true)
      return koiObj.mnemonic
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
