// Constants
import { NETWORK, WC_CHAIN_ID } from 'constants/koiConstants'
import EventEmitter from 'events'
import { get, isEmpty } from 'lodash'
// Services
import storage from 'services/storage'
// Utils
import { getSelectedTab } from 'utils/extension'

export default class WalletConnectEvents extends EventEmitter {
  async sendMessage(endpoint, payload) {
    const promise = new Promise((resolve) => {
      this.emit(endpoint, payload, resolve)
    })

    promise.then((result) => {
      if (get(result, 'error')) {
        // Handle signClient.respond Error
      } else {
        // Handle signClient.respond jsonRPC
      }
    })
  }

  // getNetworkFromPayload(payload) {
  //   let chainId

  //   if (payload.chainId.isArray()) {
  //     chainId = payload.chainId[0]
  //   } else {
  //     chainId = payload.chainId
  //   }
  //   if (WC_CHAIN_ID.ETHEREUM.includes(chainId)) return NETWORK.ETHEREUM
  //   if (WC_CHAIN_ID.SOLANA.includes(chainId)) return NETWORK.SOLANA
  // }

  // async getTabData(payload) {
  //   const network = this.getNetworkFromPayload(payload)

  //   const tab = await getSelectedTab()
  //   const url = tab.url
  //   const origin = new URL(url).origin
  //   const favicon = tab.favIconUrl

  //   const hadPermission = await storage.setting.method.checkSitePermission(origin, network)
  //   const hasPendingRequest = !isEmpty(await storage.generic.get.pendingRequest())

  //   const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()

  //   const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
  //   const defaultSolanaAddress = await storage.setting.get.activatedSolanaAccountAddress()

  //   let activatedAddress
  //   switch (network) {
  //     case NETWORK.ETHEREUM:
  //       activatedAddress = defaultEthereumAddress
  //       break
  //     case NETWORK.SOLANA:
  //       activatedAddress = defaultSolanaAddress
  //       break
  //   }

  //   let connectedAddresses = []
  //   if (hadPermission) {
  //     connectedAddresses = [activatedAddress]
  //   }

  //   return {
  //     origin,
  //     favicon,
  //     url,
  //     hadPermission,
  //     hasPendingRequest,
  //     siteAddressDictionary,
  //     activatedAddress,
  //     connectedAddresses
  //   }
  // }
}
