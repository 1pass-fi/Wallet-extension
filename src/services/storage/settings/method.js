import { NETWORK } from 'constants/koiConstants'
import { isEmpty } from 'lodash'
import storage from 'services/storage'

import { ChromeStorage } from '../ChromeStorage'

export class SettingMethod {
  #chrome
  constructor() {
    this.#chrome = new ChromeStorage()
  }

  async checkSitePermission(site, network) {
    try {
      /* 
        check existed address for a site on siteAddressDictionary
      */
      let defaultAddress, connectedAddresses
      connectedAddresses = (await storage.setting.get.siteConnectedAddresses())[site]
      if (isEmpty(connectedAddresses)) connectedAddresses = { ethereum: [], arweave: [], solana: [], k2: [] }
      if (network === NETWORK.ETHEREUM) {
        connectedAddresses = connectedAddresses.ethereum
        defaultAddress = await storage.setting.get.activatedEthereumAccountAddress()
      } else if (network === NETWORK.ARWEAVE) {
        connectedAddresses = connectedAddresses.arweave
        defaultAddress = await storage.setting.get.activatedArweaveAccountAddress()
      } else if (network === NETWORK.SOLANA) {
        connectedAddresses = connectedAddresses.solana
        defaultAddress = await storage.setting.get.activatedSolanaAccountAddress()
      } else if (network === NETWORK.K2) {
        connectedAddresses = connectedAddresses.k2
        defaultAddress = await storage.setting.get.activatedK2AccountAddress()
      }

      if (network === NETWORK.ETHEREUM) {
        return !isEmpty(connectedAddresses)
      }

      return connectedAddresses?.includes(defaultAddress)
    } catch (err) {
      throw new Error(err.message)
    }
  }
}
