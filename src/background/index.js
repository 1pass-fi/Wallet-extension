import '@babel/polyfill'

import { createPairingSession,createSignClient, signClient } from 'background/signClient'
import { IMPORTED } from 'constants/accountConstants'
// Constants
import { OS, PATH, PORTS, WC_EVENTS, WC_MESSAGES } from 'constants/koiConstants'
import storage from 'services/storage'
import { getChromeStorage } from 'utils'

import contentScriptEvents from './handlers/contentScriptEvents'
// emitter
import popupEvents from './handlers/popupEvents'
import walletConnectEvents from './handlers/walletConnectEvents'
import cache from './cache'
import streamer from './streamer'

function cb(port) {
  if (port.name.includes(PORTS.POPUP)) {
    cache.addPopupPort(port)

    port.onDisconnect.addListener((disconnect) => {
      console.log('port disconnected--', disconnect, port)
      storage.generic.set.pendingRequest({})
      cache.removePopupPort(port)
    })

    port.onMessage.addListener((message) => {
      const payload = { data: message.data, port, id: message.id }
      popupEvents.sendMessage(message.type, payload)
    })
  }

  if (port.name.includes(PORTS.CONTENT_SCRIPT)) {
    port.onMessage.addListener((message) => {
      console.log('message from contentscript =====', message)
      const payload = { data: message.data, port, id: message.id }
      contentScriptEvents.sendMessage(message.type, payload)
    })
  }
}

chrome.runtime.getPlatformInfo((info) => {
  window.localStorage.setItem(OS, info.os)
})
chrome.storage.local.remove('koiAddress')
chrome.runtime.onConnect.addListener(cb)
chrome.storage.local.remove('sitePermission')

chrome.runtime.onInstalled.addListener(async function () {
  const arweaveAccount = (await getChromeStorage(IMPORTED.ARWEAVE))[IMPORTED.ARWEAVE] || []
  const ethereumAccount = (await getChromeStorage(IMPORTED.ETHEREUM))[IMPORTED.ETHEREUM] || []
  const solanaAccount = (await getChromeStorage(IMPORTED.SOLANA))[IMPORTED.SOLANA] || []
  const k2Account = (await getChromeStorage(IMPORTED.K2))[IMPORTED.K2] || []
  if (
    !arweaveAccount.length &&
    !ethereumAccount.length &&
    !solanaAccount.length &&
    !k2Account.length
  )
    chrome.tabs.create({ url: `${PATH.GALLERY}#/` })
})

streamer()

function initializeWalletConnectEvents() {
  createSignClient()
    .then(() => {
      console.log('signClient from background', signClient)
      createPairingSession(
        'wc:1d042d8f2af96d56609d9caca1d5291f93d9d009117f9cb26e3e1acd0a743f84@2?relay-protocol=irn&symKey=eb052add59c732c0de677b17357075d1995e1d5541f7e72fff8a500bfc877ce3'
      ).then(() => {
        // Missing activate all the pairing topic

        signClient.on(WC_EVENTS.SESSION_PROPOSAL, (requestEvent) => {
          console.log('requestEvent-SESSION_PROPOSAL', requestEvent)
          const { id, params } = requestEvent
          const { requiredNamespaces, pairingTopic } = params
          const endpoint = 'solana_connect'
          walletConnectEvents.sendMessage(endpoint, payload)
        })

        signClient.on(WC_EVENTS.SESSION_REQUEST, (requestEvent) => {
          console.log('requestEvent-SESSION_REQUEST', requestEvent)
          const { id, topic, params } = requestEvent
          const { request, chainId } = params
          const payload = { id, topic, data: request, chainId }
          const endpoint = request.method

          walletConnectEvents.sendMessage(endpoint, payload)
        })

        // signClient.on(WC_EVENTS.SESSION_EVENT, (requestEvent) => {})

        // signClient.on(WC_EVENTS.SESSION_DELETE, (requestEvent) => {})
      })
      
    })
    .catch((error) => console.error('Failed to initialize wallet connect events: ', error))
}

initializeWalletConnectEvents()
