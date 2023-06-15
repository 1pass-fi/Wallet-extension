import { ALLOWED_ORIGIN } from 'constants/koiConstants'
import { includes } from 'lodash'

import initHanlders from './initHandlers'
import inject from './inject'

if (includes(ALLOWED_ORIGIN, window.origin)) {
  console.log('Finnie is ready to connect to the site.')
}

async function contentScript() {
  try {
    await initHanlders()
    await inject()
  } catch (err) {
    console.error(err)
  }
}

contentScript()
