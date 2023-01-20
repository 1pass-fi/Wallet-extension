import '@babel/polyfill'

import { ALLOWED_ORIGIN, MESSAGES } from 'constants/koiConstants'
import { includes } from 'lodash'
import storage from 'services/storage'

import initHanlders from './initHandlers'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    })
  })
}

const injectScript = async (path) => {
  const el = document.createElement('script')
  el.src = chrome.runtime.getURL(path)
  document.documentElement.appendChild(el)
  el.remove()
  await sleep()
}

async function contentScript() {
  await initHanlders()

  const disabledOrigins = await storage.setting.get.disabledOrigins()
  const origin = window.location.origin

  const disabled = disabledOrigins.includes(origin)

  const scriptPaths = [
    '/scripts/arweave.js',
    '/scripts/solanaWeb3.js',
    '/scripts/declareConstantScript.js',
    '/scripts/eventEmitter.js',
    '/scripts/finnieRpcConnectionScript.js',
    '/scripts/finnieEthereumProviderScript.js',
    '/scripts/finnieArweaveProviderScript.js',
    '/scripts/finnieSolanaProviderScript.js',
    '/scripts/finnieKoiiWalletProviderScript.js',
    '/scripts/finnieK2ProviderScript.js',
    '/scripts/mainScript.js'
  ]

  for (const path of scriptPaths) {
    await injectScript(path)
  }

  const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
  const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')
  const ethWalletLoaded = new CustomEvent('DOMContentLoaded')

  window.dispatchEvent(arweaveWalletLoaded)
  window.dispatchEvent(finnieWalletLoaded)
  window.dispatchEvent(ethWalletLoaded)
}

contentScript()
