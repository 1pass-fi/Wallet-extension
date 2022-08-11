import '@babel/polyfill'

// Constants
import { PORTS, OS, PATH } from 'constants/koiConstants'
import { IMPORTED } from 'constants/accountConstants'

import { getChromeStorage } from 'utils'

import streamer from './streamer'

// emitter
import popupEvents from './handlers/popupEvents'
import contentScriptEvents from './handlers/contentScriptEvents'

import cache from './cache'
import storage from 'services/storage'

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
