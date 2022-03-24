import EventEmitter from 'events'
import { get, isEmpty } from 'lodash'

// Constants
import { MESSAGES, PORTS } from 'constants/koiConstants'

// Utils
import { getSelectedTab } from 'utils/extension'

// Services
import storage from 'services/storage'

import cache from 'background/cache'


export default class ContentScriptEvents extends EventEmitter {
  async sendMessage(endpoint, payload) {
    const isEthereumRequest = [
      'ETHEREUM_RPC_REQUEST'
    ].includes(endpoint)
    const tabData = await this.getTabData(isEthereumRequest)

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

  async getTabData (isEthereumRequest) {
    const tab = await getSelectedTab()
    const url = tab.url
    const origin = (new URL(url)).origin
    const favicon = tab.favIconUrl

    const hadPermission = await storage.setting.method.checkSitePermission(origin, isEthereumRequest)
    const hasPendingRequest = !isEmpty(await storage.generic.get.pendingRequest())

    const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()
    
    const defaultArweaveAddress = await storage.setting.get.activatedArweaveAccountAddress()
    const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()

    const activatedAddress = isEthereumRequest ? defaultEthereumAddress : defaultArweaveAddress

    const siteConnectedAddresses = (await storage.setting.get.siteConnectedAddresses())[origin]
    let connectedAddresses = []
    if (hadPermission) {
      connectedAddresses = [activatedAddress]
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
