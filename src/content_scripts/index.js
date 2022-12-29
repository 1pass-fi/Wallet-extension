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

  chrome.runtime.sendMessage(
    {
      message: MESSAGES.CODE_INJECTION,
      pageDisabled: disabled
    },
    (response) => {
      if (response.message === MESSAGES.CODE_INJECTED) {
        const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
        const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')
        const ethWalletLoaded = new CustomEvent('DOMContentLoaded')

        window.dispatchEvent(arweaveWalletLoaded)
        window.dispatchEvent(finnieWalletLoaded)
        window.dispatchEvent(ethWalletLoaded)
      }
    }
  )
}

contentScript()
