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
      // query for activated account
      const activatedAccount = await storage.setting.get.activatedAccount()
      const account = popupAccount.getAccount({ address: activatedAccount })
      const approvedOrigin = await account.get.connectedSite() || []
      return approvedOrigin.includes(site)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
