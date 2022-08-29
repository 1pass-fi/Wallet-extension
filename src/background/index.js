import '@babel/polyfill'
import 'regenerator-runtime/runtime.js'

import { IMPORTED } from 'constants/accountConstants'
// Constants
import { OS, PATH,PORTS } from 'constants/koiConstants'
import storage from 'services/storage'
import { getChromeStorage } from 'utils'

import contentScriptEvents from './handlers/contentScriptEvents'
// emitter
import popupEvents from './handlers/popupEvents'
import cache from './cache'
import streamer from './streamer'

import inject from './inject'

import declareConstantScript from 'content_scripts/scripts/declareConstantScript'
import eventEmitterScript from 'content_scripts/scripts/eventEmitterScript'
import finnieRpcConnectionScript from 'content_scripts/scripts/finnieRpcConnectionScript'
import finnieEthereumProviderScript from 'content_scripts/scripts/finnieEthereumProviderScript'
import finnieArweaveProviderScript from 'content_scripts/scripts/finnieArweaveProviderScript'
import finnieSolanaProviderScript from 'content_scripts/scripts/finnieSolanaProviderScript'
import finnieKoiiWalletProviderScript from 'content_scripts/scripts/finnieKoiiWalletProviderScript'
import mainScript from 'content_scripts/scripts/mainScript'

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
  // window.localStorage.setItem(OS, info.os)
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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.name === 'CODE_INJECTION') {
    const scripts = [
      `(${declareConstantScript})()`,
      `(${eventEmitterScript})()`,
      `(${finnieRpcConnectionScript})()`,
      `(${finnieEthereumProviderScript})()`,
      `(${finnieArweaveProviderScript})()`,
      `(${finnieSolanaProviderScript})()`,
      `(${finnieKoiiWalletProviderScript})()`,
      `(${mainScript(message.disabled)})();`
    ]
    inject(scripts)
    sendResponse({ name: 'CODE_INJECTED' })
  }
})
