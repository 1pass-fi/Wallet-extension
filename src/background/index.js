import '@babel/polyfill'

import { PORTS } from 'constants'
import popUpEventHandlers from './popupEventHandlers'
import contentScriptEventHandlers from './contentScriptEventHandlers'
import { Web } from 'koi_tools/web'
/* eslint-disable no-undef */
const koi = new Web()
console.log('Background.js file loaded')

browser.runtime.onMessage.addListener(function (message) {
  console.log(message)
})

chrome.runtime.onConnect.addListener(function (port) {
  console.log(port)
  switch (port.name) {
    case PORTS.POPUP:
      port.onMessage.addListener(message => {
        popUpEventHandlers(koi, port, message)
      })
      break
    case PORTS.CONTENT_SCRIPT:
      port.onMessage.addListener(message => {
        contentScriptEventHandlers(koi, port, message)
      })
      break
  }
})
