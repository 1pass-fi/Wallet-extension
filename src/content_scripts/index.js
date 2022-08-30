// constants
import { ALLOWED_ORIGIN, MESSAGES } from 'constants/koiConstants'
import declareConstantScript from 'content_scripts/scripts/declareConstantScript'
import eventEmitterScript from 'content_scripts/scripts/eventEmitterScript'
import finnieArweaveProviderScript from 'content_scripts/scripts/finnieArweaveProviderScript'
import finnieEthereumProviderScript from 'content_scripts/scripts/finnieEthereumProviderScript'
import finnieKoiiWalletProviderScript from 'content_scripts/scripts/finnieKoiiWalletProviderScript'
import finnieRpcConnectionScript from 'content_scripts/scripts/finnieRpcConnectionScript'
import finnieSolanaProviderScript from 'content_scripts/scripts/finnieSolanaProviderScript'
import mainScript from 'content_scripts/scripts/mainScript'
import { includes } from 'lodash'
import storage from 'services/storage'

import '@babel/polyfill'

import initHanlders from './initHandlers'
import inject from './inject'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

async function contentScript () {
  await initHanlders()

  const disabledOrigins = await storage.setting.get.disabledOrigins()
  const origin = window.location.origin

  const disabled = disabledOrigins.includes(origin)

  /* 
    Script injection
  */
  const scripts = [
    `(${declareConstantScript})()`,
    `(${eventEmitterScript})()`,
    `(${finnieRpcConnectionScript})()`,
    `(${finnieEthereumProviderScript})()`,
    `(${finnieArweaveProviderScript})()`,
    `(${finnieSolanaProviderScript})()`,
    `(${finnieKoiiWalletProviderScript})()`,
    `(${mainScript(disabled)})();`
  ]

  inject(scripts)

  const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
  const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')
  const ethWalletLoaded = new CustomEvent('DOMContentLoaded')

  window.dispatchEvent(arweaveWalletLoaded)
  window.dispatchEvent(finnieWalletLoaded)
  window.dispatchEvent(ethWalletLoaded)
}

contentScript()
