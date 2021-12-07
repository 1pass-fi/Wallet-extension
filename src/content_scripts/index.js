import '@babel/polyfill'
import { includes } from 'lodash'

// constants
import { ALLOWED_ORIGIN } from 'constants/koiConstants'

import inject from './inject'
import inpageScript from './inpageScript'
import initHanlders from './initHandlers'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

async function contentScript () {
  await initHanlders()

  inject(inpageScript)

  const arweaveWalletLoaded = new CustomEvent('arweaveWalletLoaded')
  const finnieWalletLoaded = new CustomEvent('finnieWalletLoaded')

  window.dispatchEvent(arweaveWalletLoaded)
  window.dispatchEvent(finnieWalletLoaded)
}

contentScript()
