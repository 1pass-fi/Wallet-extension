import '@babel/polyfill'

// import { createPairingSession,createSignClient, signClient } from 'background/signClient'
import { IMPORTED } from 'constants/accountConstants'
// Constants
import { OS, PATH, PORTS, WC_EVENTS, WC_MESSAGES } from 'constants/koiConstants'
import storage from 'services/storage'
import walletConnect from 'services/walletConnect'
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

const initWalletConnect = async () => {
  try {
    await walletConnect.init()
    const pairings = await walletConnect.signClient.core.pairing.getPairings()
    console.log('parings', pairings)
  
    walletConnect.signClient.on('session_proposal', (event) => {
      walletConnect.approve(event)
    })
    
    walletConnect.signClient.on('session_request', (event) => {
      console.log('session_request event', event)

      const endpoint = event.params.request.method
      const payload = { id: event.id, topic: event.topic, params: event.params.request.params }
      walletConnectEvents.sendMessage(endpoint, payload)
    })
  
  } catch (err) {
    console.error('Init walletconnect error:', err)
  }
}

initWalletConnect()
