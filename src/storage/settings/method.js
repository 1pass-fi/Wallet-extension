import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from '../storageConstants'

import { popupAccount } from 'account'
import storage from 'storage'


export class SettingMethod {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  async checkSitePermission(site) {
    try {
      /* 
        query for connect_site_account
      */
      const connectSiteAccountAddress = await storage.setting.get.connectSiteAccountAddress()
      if (!connectSiteAccountAddress) return false

      const account = await popupAccount.getAccount({ address: connectSiteAccountAddress })
      const approvedOrigin = await account.get.connectedSite() || []
      return approvedOrigin.includes(site)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
