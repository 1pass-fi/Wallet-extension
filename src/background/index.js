import '@babel/polyfill'
import { Web } from '@_koi/sdk/web'

// Constants
import { PORTS, OS, PATH } from 'constants/koiConstants'
import { IMPORTED } from 'constants/accountConstants'

// Handlers
import popupEventHandlers from './handlers/popupEventHandlers'
import contentScriptEventHandlers from './handlers/contentScriptEventHandlers'

import { Ethereum } from 'services/ethereum'

import { getChromeStorage } from 'utils'

import streamer from './streamer'

const koi = new Web()
const eth = new Ethereum()
const ports = {}
const permissionId = []
const createTransactionId = []
const sender = []

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
      popupEventHandlers(
        koi,
        port,
        message,
        ports,
        { permissionId, createTransactionId },
        eth
      )
    })
  }

  if ((port.name).includes(PORTS.CONTENT_SCRIPT)) {
    port.onMessage.addListener(message => {
      contentScriptEventHandlers(koi, port, message, ports, { permissionId, createTransactionId }, sender)
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
