import '@babel/polyfill'

import xmlHttpRequest from 'xmlhttprequest-ssl'

global.window = global

import { IMPORTED } from 'constants/accountConstants'
import { MESSAGES, OS, PATH, PORTS } from 'constants/koiConstants'
import storage from 'services/storage'
import walletConnect from 'services/walletConnect'
import { getChromeStorage } from 'utils'
import walletConnectUtils from 'utils/walletConnect'

import 'regenerator-runtime/runtime.js'

import contentScriptEvents from './handlers/contentScriptEvents'
import popupEvents from './handlers/popupEvents'
import walletConnectEvents from './handlers/walletConnectEvents'
import declareConstantScript from './scripts/declareConstantScript'
import eventEmitterScript from './scripts/eventEmitterScript'
import finnieArweaveProviderScript from './scripts/finnieArweaveProviderScript'
import finnieEthereumProviderScript from './scripts/finnieEthereumProviderScript'
import finnieK2ProviderScript from './scripts/finnieK2ProviderScript'
import finnieKoiiWalletProviderScript from './scripts/finnieKoiiWalletProviderScript'
import finnieRpcConnectionScript from './scripts/finnieRpcConnectionScript'
import finnieSolanaProviderScript from './scripts/finnieSolanaProviderScript'
import mainScript from './scripts/mainScript'
import cache from './cache'
import helpers from './helpers'
import inject from './inject'
import streamer from './streamer'

/* a workaournd to keep service worker alive */

/**
 * On disconnect -> reconnect
 */
function connect() {
  chrome.runtime.connect({name: 'keepAlive'})
    .onDisconnect.addListener(connect)
}

/**
 *  find all tab and execute connect script
 *  the connect script will be executed on page context eg. google.com
 */
async function findTab(tabs) {
  const onUpdate = (_, info, tab) => /^https?:/.test(info.url) && findTab([tab])

  if (chrome.runtime.lastError) { 
    console.log('tab was closed before setTimeout ran')
  }

  for (const {id: tabId} of tabs || await chrome.tabs.query({url: '*://*/*'})) {
    try {
      await chrome.scripting.executeScript({target: {tabId}, func: connect})
      chrome.tabs.onUpdated.removeListener(onUpdate) // remove to make sure connect will not run more than one time
      return
    } catch (e) {}
  }

  /* when a tab is closed or modified, get all tabs and run connect script */
  chrome.tabs.onUpdated.addListener(onUpdate)
}

findTab()

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
      const payload = { data: message.data, port, id: message.id }
      contentScriptEvents.sendMessage(message.type, payload)
    })
  }

  /* 
    disconnect port every 5 minutes
    invoke onDisconnect listener -> reconnect
  */
  if (port.name === 'keepAlive') {
    console.log('Keep Alive')
    setTimeout(() => port.disconnect(), 250000) // 5 minutes
    port.onDisconnect.addListener(() => findTab())
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

const initWalletConnect = async () => {
  try {
    await walletConnect.init()
    const pairings = walletConnect.signClient.core.pairing.getPairings()

    walletConnect.signClient.on('session_proposal', (event) => {
      helpers.sendMessageToPopupPorts({
        type: MESSAGES.WC_SESSION_PROPOSAL,
        payload: event
      })
    })

    walletConnect.signClient.on('session_request', async (event) => {
      const endpoint = event.params.request.method
      const payload = { id: event.id, topic: event.topic, params: event.params.request.params }

      // validate request
      const isValidChain = await walletConnectUtils.validateSessionRequest.validateChainID(
        event.params
      )
      const isValidAccount = await walletConnectUtils.validateSessionRequest.validateAccount(
        event.params
      )

      if (!isValidChain) {
        walletConnect.response({
          id: event.id,
          topic: event.topic,
          result: {
            error: {
              code: 4001,
              message: 'No matching chain'
            }
          }
        })
        return
      }

      if (!isValidAccount) {
        walletConnect.response({
          id: event.id,
          topic: event.topic,
          result: {
            error: {
              code: 4004,
              message: 'Account is not imported'
            }
          }
        })
        return
      }
      walletConnectEvents.sendMessage(endpoint, payload)
    })
  } catch (err) {
    console.error('Init walletconnect error:', err)
  }
}

initWalletConnect()

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === MESSAGES.CODE_INJECTION) {
    const pScript = `const arweaveScriptElement = document.createElement('script')
    const solanaWeb3ScriptElement = document.createElement('script')
    arweaveScriptElement.src = 'https://unpkg.com/arweave/bundles/web.bundle.js'
    solanaWeb3ScriptElement.src = 'https://unpkg.com/@solana/web3.js@latest/lib/index.iife.min.js'

    document.documentElement.appendChild(arweaveScriptElement)
    document.documentElement.appendChild(solanaWeb3ScriptElement)`
    const scripts = [
      pScript,
      `(${declareConstantScript})()`,
      `(${eventEmitterScript})()`,
      `(${finnieRpcConnectionScript})()`,
      `(${finnieEthereumProviderScript})()`,
      `(${finnieArweaveProviderScript})()`,
      `(${finnieSolanaProviderScript})()`,
      `(${finnieKoiiWalletProviderScript})()`,
      `(${finnieK2ProviderScript})()`,
      `(${mainScript(request.pageDisabled)})();`
    ]

    inject(scripts).then(() => {
      sendResponse({ message: MESSAGES.CODE_INJECTED })
    })

    return true // send message async
  }
})

global.XMLHttpRequest = xmlHttpRequest.XMLHttpRequest
