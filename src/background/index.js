import '@babel/polyfill'

import { PORTS } from 'koiConstants'
import popUpEventHandlers from './popupEventHandlers'
import contentScriptEventHandlers from './contentScriptEventHandlers'
import { Web } from '@_koi/sdk/web'
// import { Web } from './koiMock'

/* eslint-disable no-undef */
export const koi = new Web()
console.log('Background.js file loaded')

browser.runtime.onMessage.addListener(function (message) {
  console.log(message)
})

const ports = {}
const permissionId = []
const createTransactionId = []

chrome.runtime.onConnect.addListener(function (port) {
  switch (port.name) {
    case PORTS.POPUP:
      ports[PORTS.POPUP] = port
      port.onMessage.addListener(message => {
        popUpEventHandlers(koi, port, message, ports, { permissionId, createTransactionId })
      })
      break
    case PORTS.CONTENT_SCRIPT:
      ports[PORTS.CONTENT_SCRIPT] = port
      port.onMessage.addListener(message => {
        contentScriptEventHandlers(koi, port, message, ports, { permissionId, createTransactionId })
      })
      break
  }
})
