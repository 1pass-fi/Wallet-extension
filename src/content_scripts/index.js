import { ALLOWED_ORIGIN, MESSAGES } from 'constants/koiConstants'
import { includes } from 'lodash'
import concat from 'lodash/concat'
import get from 'lodash/get'
import storage from 'services/storage'

import initHanlders from './initHandlers'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

const sleep = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 100)
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
  try {
    await initHanlders()
  
    const disabledOrigins = await storage.setting.get.disabledOrigins()
    const overwriteMetamaskSites = await storage.setting.get.overwriteMetamaskSites()

    const finnieDisabled = disabledOrigins.includes(window.location.origin)
  
    const hasMetamaskInstalled = await chrome.runtime.sendMessage('checkMetamask')
    const shouldOverwriteMetamask = get(overwriteMetamaskSites, [origin, 'shouldOverwriteMetamask'], false)

    const shouldInjectFinnie = !hasMetamaskInstalled || shouldOverwriteMetamask

    const scriptPaths = [
      '/scripts/arweave.js',
      '/scripts/solanaWeb3.js',
      '/scripts/declareConstantScript.js',
      '/scripts/eventEmitter.js',
      '/scripts/finnieRpcConnectionScript.js',
      shouldInjectFinnie && '/scripts/finnieEthereumProviderScript.js',
      shouldInjectFinnie && '/scripts/finnieArweaveProviderScript.js',
      shouldInjectFinnie && '/scripts/finnieSolanaProviderScript.js',
      '/scripts/finnieKoiiWalletProviderScript.js',
      '/scripts/finnieK2ProviderScript.js',
      '/scripts/mainScript.js'
    ].filter(s => s)
    
    if (!finnieDisabled) {
      for (const path of scriptPaths) {
        await injectScript(path)
      }
    }
  
    const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
    const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')
    const ethWalletLoaded = new CustomEvent('DOMContentLoaded')
  
    window.dispatchEvent(arweaveWalletLoaded)
    window.dispatchEvent(finnieWalletLoaded)
    window.dispatchEvent(ethWalletLoaded)
  } catch (err) {
    console.error(err)
  }
}

contentScript()
