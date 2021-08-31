import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from '../storageConstants'

import { backgroundAccount, popupAccount } from 'account'
import storage from 'storage'


export class SettingMethod {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  async checkSitePermission(site) {
    try {


      /* 
        check existed address for a site on siteAddressDictionary
      */
      const siteAddressDictionary = await storage.setting.get.siteAddressDictionary() || {}
      const respectiveAddress = siteAddressDictionary[site]
      const accountExists = !backgroundAccount.importedAccount.every(credentials => {
        return credentials.address !== respectiveAddress
      })
      if (!accountExists) return false
      return true
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
