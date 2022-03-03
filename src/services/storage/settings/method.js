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
      // const siteAddressDictionary = await storage.setting.get.siteAddressDictionary() || {}
      // const respectiveAddress = siteAddressDictionary[site]
      // const accountExists = !backgroundAccount.importedAccount.every(credentials => {
      //   return credentials.address !== respectiveAddress
      // })
      // if (!accountExists) return false
      // if (isEthereumRequest && !isEthereumAddress(respectiveAddress)) return false
      // if (!isEthereumRequest && isEthereumAddress(respectiveAddress)) return false
      // return true
      let defaultAddress, connectedAddresses
      connectedAddresses = await storage.setting.get.siteConnectedAddresses()[site]
      if (isEmpty(connectedAddresses)) connectedAddresses = { ethereum: [], arweave: [] }
      if (isEthereumRequest) {
        connectedAddresses = connectedAddresses.ethereum
        defaultAddress = await storage.setting.get.activatedEthereumAccountAddress()
      } else {
        connectedAddresses = connectedAddresses.arweave
        defaultAddress = await storage.setting.get.activatedArweaveAccountAddress()
      }

      return connectedAddresses.includes(defaultAddress)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
