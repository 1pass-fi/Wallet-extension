import '@babel/polyfill'

import { ALLOWED_ORIGIN, MESSAGES } from 'constants/koiConstants'
import { includes } from 'lodash'
import storage from 'services/storage'

import initHanlders from './initHandlers'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

async function contentScript() {
  await initHanlders()

  const disabledOrigins = await storage.setting.get.disabledOrigins()
  const origin = window.location.origin

  const disabled = disabledOrigins.includes(origin)

  const el = document.createElement('script')
  el.src = chrome.runtime.getURL('/scripts/arweave.js')
  document.documentElement.appendChild(el)
  el.remove()
  const el1 = document.createElement('script')
  el1.src = chrome.runtime.getURL('/scripts/solanaWeb3.js')
  document.documentElement.appendChild(el1)
  el1.remove()
  const el2 = document.createElement('script')
  el2.src = chrome.runtime.getURL('/scripts/declareConstantScript.js')
  document.documentElement.appendChild(el2)
  el2.remove()
  const el3 = document.createElement('script')
  el3.src = chrome.runtime.getURL('/scripts/eventEmitter.js')
  document.documentElement.appendChild(el3)
  el3.remove()
  const el4 = document.createElement('script')
  el4.src = chrome.runtime.getURL('/scripts/finnieRpcConnectionScript.js')
  document.documentElement.appendChild(el4)
  el4.remove()
  const el5 = document.createElement('script')
  el5.src = chrome.runtime.getURL('/scripts/finnieEthereumProviderScript.js')
  document.documentElement.appendChild(el5)
  el5.remove()
  const el6 = document.createElement('script')
  el6.src = chrome.runtime.getURL('/scripts/finnieArweaveProviderScript.js')
  document.documentElement.appendChild(el6)
  el6.remove()
  const el7 = document.createElement('script')
  el7.src = chrome.runtime.getURL('/scripts/finnieSolanaProviderScript.js')
  document.documentElement.appendChild(el7)
  el7.remove()
  const el8 = document.createElement('script')
  el8.src = chrome.runtime.getURL('/scripts/finnieKoiiWalletProviderScript.js')
  document.documentElement.appendChild(el8)
  el8.remove()
  const el9 = document.createElement('script')
  el9.src = chrome.runtime.getURL('/scripts/finnieK2ProviderScript.js')
  document.documentElement.appendChild(el9)
  el9.remove()
  const el10 = document.createElement('script')
  el10.src = chrome.runtime.getURL('/scripts/mainScript.js')
  document.documentElement.appendChild(el10)
  el10.remove()

  const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
  const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')
  const ethWalletLoaded = new CustomEvent('DOMContentLoaded')

  window.dispatchEvent(arweaveWalletLoaded)
  window.dispatchEvent(finnieWalletLoaded)
  window.dispatchEvent(ethWalletLoaded)
}

contentScript()
