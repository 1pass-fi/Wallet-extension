import '@babel/polyfill'

// Constants
import { PORTS, OS, PATH } from 'constants/koiConstants'
import { IMPORTED } from 'constants/accountConstants'

import { getChromeStorage } from 'utils'

import streamer from './streamer'

// emitter
import popupEvents from './handlers/popupEvents'
import contentScriptEvents from './handlers/contentScriptEvents'

export const popupPorts = []

function cb(port) {
  if ((port.name).includes(PORTS.POPUP)) {
    popupPorts.push(port)
    port.onDisconnect.addListener((disconnect) => {
      console.log('port disconnected--', disconnect, port)
      for (let i = 0; i < popupPorts.length; i++) {
        if (port.name === popupPorts[i].name) {
          popupPorts.splice(i, 1)
          break
        }
      }
    })

    port.onMessage.addListener((message) => {
      const payload = { data: message.data, port, id: message.id }
      popupEvents.sendMessage(message.type, payload)
    })
  }

  if ((port.name).includes(PORTS.CONTENT_SCRIPT)) {
    port.onMessage.addListener(message => {
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
  if (!arweaveAccount.length && !ethereumAccount.length) chrome.tabs.create({ url: `${PATH.GALLERY}#/` })
})

streamer()
