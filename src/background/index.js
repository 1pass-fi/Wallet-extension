import '@babel/polyfill'

import { PORTS, LOAD_BALANCES_TIME_INTERVAL, OS } from 'koiConstants'
import popUpEventHandlers, { loadBalances } from './popupEventHandlers'
import contentScriptEventHandlers from './contentScriptEventHandlers'
import { Web } from '@_koi/sdk/web'
// import { Web } from './koiMock'

/* eslint-disable no-undef */
export const koi = new Web()
console.log('Finnie is waiting for instructions.')

const ports = {}
const permissionId = []
const createTransactionId = []
let autoLoadBalancesInterval
let autoLoadBalancesPort
const autoLoadBalances = (koi) => {
  autoLoadBalancesInterval = setInterval(() => {
    loadBalances(koi, autoLoadBalancesPort)
  }, LOAD_BALANCES_TIME_INTERVAL)
}

function cb(port) {
  switch (port.name) {
    case PORTS.POPUP:
      ports[PORTS.POPUP] = port

      port.onDisconnect.addListener(disconnect => {
        console.log('port disconnected--', disconnect, port)
        autoLoadBalancesPort = undefined
      })

      port.onMessage.addListener(message => {
        popUpEventHandlers(koi, port, message, ports, { permissionId, createTransactionId })

        if (koi.address) {
          autoLoadBalancesPort = port
          if (!autoLoadBalancesInterval) {
            autoLoadBalances(koi)
          }
        }
      })
      break
    case PORTS.CONTENT_SCRIPT:
      ports[PORTS.CONTENT_SCRIPT] = port
      port.onMessage.addListener(message => {
        contentScriptEventHandlers(koi, port, message, ports, { permissionId, createTransactionId })
      })
      break
  }
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.getPlatformInfo((info) => {
      window.localStorage.setItem(OS, info.os)
    })
    chrome.storage.local.remove('koiAddress')
    chrome.runtime.onConnect.addListener(cb)
  })

  chrome.runtime.onStartup.addListener(() => {
    chrome.runtime.getPlatformInfo((info) => {
      window.localStorage.setItem(OS, info.os)
    })
    chrome.runtime.onConnect.addListener(cb)
  })
}
