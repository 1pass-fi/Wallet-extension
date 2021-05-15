import '@babel/polyfill'

import koiTools from 'koi_tools'
import { PORTS } from 'constants'
import popUpEventHandlers from './poupEventHandlers'

/* eslint-disable no-undef */
const koi = new koiTools.koi_tools()
console.log('Background.js file loaded')

/* const defaultUninstallURL = () => {
  return process.env.NODE_ENV === 'production'
    ? 'https://wwww.github.com/kryptokinght'
    : '';
}; */

browser.runtime.onMessage.addListener(function (message) {
  console.log(message)
})

chrome.runtime.onConnect.addListener(function(port) {
  if (port.name === PORTS.POPUP) {
    port.onMessage.addListener(message => {
      popUpEventHandlers(koi, port, message)
    })
  }
})
