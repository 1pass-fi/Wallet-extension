import { ChromeStorage } from '../ChromeStorage'
import { GENERIC } from 'constants/storageConstants'


export class GenericMethod {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  async deleteSite(site) {
    try {
      let approvedOrigin = await this.#chrome._getChrome(GENERIC.CONNECTED_SITE) || []
      approvedOrigin = approvedOrigin.filter(origin => origin !== site)
      await this.#chrome._setChrome(GENERIC.CONNECTED_SITE, approvedOrigin)
    } catch (err) {
      console.log(err.message)
      throw new Error(err.message)
    }
  }

  async addSite(site) {
    try {
      let approvedOrigin = await this.#chrome._getChrome(GENERIC.CONNECTED_SITE) || []
      approvedOrigin.push(site)
      await this.#chrome._setChrome(GENERIC.CONNECTED_SITE, approvedOrigin)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
