import { ChromeStorage } from 'services/storage/ChromeStorage'

export class AccountStorageUtils extends ChromeStorage {
  #address
  constructor(address) {
    super()
    this.#address = address
  }

  async getField(field) {
    try {
      const account = await this._getChrome(this.#address)
      return account[field]
    } catch (err) {
      console.log('Error: ', err.message)
    }
  }

  async setField(field, value) {
    try {
      const account = await this._getChrome(this.#address)
      account[field] = value
      await this._setChrome(this.#address, account)
    } catch (err) {
      console.log('Error: ', err.message)
    }
  }

  async getAssets() {
    const assets = await this._getChrome(`${this.#address}_assets`)
    return assets
  }

  async setAssets(value) {
    await this._setChrome(`${this.#address}_assets`, value)
  }

  async getCollections() {
    const collections = await this._getChrome(`${this.#address}_collections`)
    return collections
  }

  async setCollections(value) {
    await this._setChrome(`${this.#address}_collections`, value)
  }

  async getKID() {
    const KID = await this._getChrome(`${this.#address}_kid`)
    return KID
  }

  async setKID(value) {
    await this._setChrome(`${this.#address}_kid`, value)
  }

  async getPendingAssets() {
    return await this._getChrome(`${this.#address}_pendingAssets`) || []
  }

  async setPendingAssets(value) {
    await this._setChrome(`${this.#address}_pendingAssets`, value)
  }
}
