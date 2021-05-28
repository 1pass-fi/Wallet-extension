import '@babel/polyfill'

import { PORTS, LOAD_BALANCES_TIME_INTERVAL } from 'koiConstants'
import popUpEventHandlers, { loadBalances } from './popupEventHandlers'
import contentScriptEventHandlers from './contentScriptEventHandlers'
import { Web } from 'koi_tools/web'
// import { Web } from './koiMock'

/* eslint-disable no-undef */
const koi = new Web()
console.log('Background.js file loaded')

browser.runtime.onMessage.addListener(function (message) {
  console.log(message)
})

let autoLoadBalancesInterval
const autoLoadBalances = (koi, port) => {
  autoLoadBalancesInterval = setInterval(() => {
    loadBalances(koi, port)
  }, LOAD_BALANCES_TIME_INTERVAL)
}

chrome.runtime.onConnect.addListener(function (port) {
  console.log(port)
  switch (port.name) {
    case PORTS.POPUP: {
      port.onDisconnect.addListener(disconnect => {
        console.log('port disconnected--', disconnect, port)
        clearInterval(autoLoadBalancesInterval)
        autoLoadBalancesInterval = undefined
      })

      port.onMessage.addListener(message => {
        popUpEventHandlers(koi, port, message)

        if (koi.address && !autoLoadBalancesInterval) {
          autoLoadBalances(koi, port)
        }
      })
      break
    }
    case PORTS.CONTENT_SCRIPT:
      port.onMessage.addListener(message => {
        contentScriptEventHandlers(koi, port, message)
      })
      break
  }
})
