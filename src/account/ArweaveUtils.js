export class ArweaveUtils {

  async loadWallet (koiObj, key) {
    try {
      await koiObj.loadWallet(key)
  
      return koiObj.address
  
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
