import '@babel/polyfill'

import { PORTS, LOAD_BALANCES_TIME_INTERVAL } from 'koiConstants'
import popUpEventHandlers, { loadBalances } from './popupEventHandlers'
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
let autoLoadBalancesInterval
let autoLoadBalancesPort
const autoLoadBalances = (koi) => {
  autoLoadBalancesInterval = setInterval(() => {
    loadBalances(koi, autoLoadBalancesPort)
  }, LOAD_BALANCES_TIME_INTERVAL)
}

if (chrome.runtime.onInstalled) {
  chrome.runtime.onInstalled.addListener((details) => {
    chrome.runtime.onConnect.addListener(function (port) {
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
    })
  })
} else {
  chrome.runtime.onConnect.addListener(function (port) {
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
  })
}

// chrome.runtime.onConnect.addListener(function (port) {
//   switch (port.name) {
//     case PORTS.POPUP:
//       ports[PORTS.POPUP] = port

//       port.onDisconnect.addListener(disconnect => {
//         console.log('port disconnected--', disconnect, port)
//         autoLoadBalancesPort = undefined
//       })

//       port.onMessage.addListener(message => {
//         popUpEventHandlers(koi, port, message, ports, { permissionId, createTransactionId })

//         if (koi.address) {
//           autoLoadBalancesPort = port
//           if (!autoLoadBalancesInterval) {
//             autoLoadBalances(koi)
//           }
//         }
//       })
//       break
//     case PORTS.CONTENT_SCRIPT:
//       ports[PORTS.CONTENT_SCRIPT] = port
//       port.onMessage.addListener(message => {
//         contentScriptEventHandlers(koi, port, message, ports, { permissionId, createTransactionId })
//       })
//       break
//   }
// })
