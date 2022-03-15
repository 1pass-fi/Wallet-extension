import { ChromeStorage } from '../ChromeStorage'
import { SETTING } from 'constants/storageConstants'
import { isEmpty } from 'lodash'

import { backgroundAccount, popupAccount } from 'services/account'
import storage from 'services/storage'

import { isEthereumAddress } from 'utils'


export class SettingMethod {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  async checkSitePermission(site, isEthereumRequest) {
    try {
      /* 
        check existed address for a site on siteAddressDictionary
      */
      let defaultAddress, connectedAddresses
      connectedAddresses = (await storage.setting.get.siteConnectedAddresses())[site]
      console.log('connectedAddresses', connectedAddresses)
      if (isEmpty(connectedAddresses)) connectedAddresses = { ethereum: [], arweave: [] }
      if (isEthereumRequest) {
        connectedAddresses = connectedAddresses.ethereum
        defaultAddress = await storage.setting.get.activatedEthereumAccountAddress()
      } else {
        connectedAddresses = connectedAddresses.arweave
        defaultAddress = await storage.setting.get.activatedArweaveAccountAddress()
      }

      console.log('defaultAddress', defaultAddress)
      console.log('connectedAddresses', connectedAddresses)

      return connectedAddresses.includes(defaultAddress)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
