import '@babel/polyfill'
import { includes } from 'lodash'

// constants
import { ALLOWED_ORIGIN } from 'constants/koiConstants'
import storage from 'services/storage'

import inject from './inject'
import inpageScript from './inpageScript'
import eventEmitterScript from './eventEmitterScript'
import initHanlders from './initHandlers'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

async function contentScript () {
  await initHanlders()

  const disabledOrigins = await storage.setting.get.disabledOrigins()
  const origin = window.location.origin

  const disabled = disabledOrigins.includes(origin)

  inject(inpageScript(disabled), eventEmitterScript)

  const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
  const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')

  window.dispatchEvent(arweaveWalletLoaded)
  window.dispatchEvent(finnieWalletLoaded)
}

contentScript()
