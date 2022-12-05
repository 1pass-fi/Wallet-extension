import cache from 'background/cache'
// Constants
import { MESSAGES, NETWORK } from 'constants/koiConstants'
import EventEmitter from 'events'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
// Services
import storage from 'services/storage'
// Utils
import { getSelectedTab } from 'utils/extension'



export default class ContentScriptEvents extends EventEmitter {
  async sendMessage(endpoint, payload) {
    const network = this.getNetworkFromEndpoint(endpoint)

    const tabData = await this.getTabData(network)
    const { port } = payload

    const promise = new Promise((resolve) => {
      this.emit(endpoint, payload, tabData, resolve)
    })

    const twoStepEndpoints = [
      MESSAGES.CONNECT,
      MESSAGES.CREATE_TRANSACTION,
      MESSAGES.KOI_CONNECT,
      MESSAGES.KOI_CREATE_TRANSACTION,
      MESSAGES.KOI_CREATE_DID,
      MESSAGES.KOI_UPDATE_DID
    ] 

    if (twoStepEndpoints.includes(endpoint) && !tabData.hasPendingRequest) {
      const contentScriptPort = {
        port,
        id: payload.id,
        endpoint
      }

      cache.setContentScriptPort(contentScriptPort)
    }

    promise.then(result => {
      if (get(result, 'error')) {
        port.postMessage({
          type: `${endpoint}_ERROR`,
          data: get(result, 'error'),
          id: payload.id
        })
      } else {
        port.postMessage({
          type: `${endpoint}_SUCCESS`,
          data: get(result, 'data'),
          id: payload.id
        })
      }
    })
  }

  getNetworkFromEndpoint(endpoint) {
    if (['ETHEREUM_RPC_REQUEST'].includes(endpoint)) return NETWORK.ETHEREUM
    if (endpoint?.includes('SOLANA')) return NETWORK.SOLANA
    if (endpoint?.includes('K2')) return NETWORK.K2
    return NETWORK.ARWEAVE
  }

  async getTabData (network) {
    const tab = (await getSelectedTab())[0]
    const url = tab.url
    const origin = (new URL(url)).origin
    const favicon = tab.favIconUrl

    const hadPermission = await storage.setting.method.checkSitePermission(origin, network)
    const hasPendingRequest = !isEmpty(await storage.generic.get.pendingRequest())

    const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()
    
    const defaultArweaveAddress = await storage.setting.get.activatedArweaveAccountAddress()
    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
    const defaultSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()
    const defaultK2Address = await storage.setting.get.activatedK2AccountAddress()

    let activatedAddress

    switch (network) {
      case NETWORK.ARWEAVE: 
        activatedAddress = defaultArweaveAddress
        break
      case NETWORK.ETHEREUM:
        activatedAddress = defaultEthereumAddress
        break
      case NETWORK.SOLANA:
        activatedAddress = defaultSolanaAddress
        break
      case NETWORK.K2:
        activatedAddress = defaultK2Address
    }

    const siteConnectedAddresses = (await storage.setting.get.siteConnectedAddresses())[origin]
    let connectedAddresses = []
    if (hadPermission) {
      if (network === NETWORK.ETHEREUM) {
        connectedAddresses = siteConnectedAddresses.ethereum
      } else if (network === NETWORK.SOLANA) {
        connectedAddresses = siteConnectedAddresses.solana
      } else if (network === NETWORK.K2) {
        connectedAddresses = siteConnectedAddresses.k2
      } else {
        connectedAddresses = [activatedAddress]
      }
    }

    return { 
      origin, 
      favicon, 
      url, 
      hadPermission, 
      hasPendingRequest,
      siteAddressDictionary,
      activatedAddress,
      connectedAddresses
    }
  }
}
