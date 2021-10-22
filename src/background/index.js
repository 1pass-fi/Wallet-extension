import '@babel/polyfill'

import { PORTS, LOAD_BALANCES_TIME_INTERVAL, LOAD_TRANSACTION_STATE_INTERVAL, OS, PATH, LOAD_ETH_BALANCES_TIME_INTERVAL } from 'constants/koiConstants'
import { IMPORTED } from 'constants/accountConstants'
import popUpEventHandlers, { loadBalances, updatePendingTransactions } from './popupEventHandlers'
import contentScriptEventHandlers from './contentScriptEventHandlers'
import { Web } from '@_koi/sdk/web'
import { Ethereum } from './eth'
import { TYPE } from 'constants/accountConstants'

import { getChromeStorage } from 'utils'
// import { Web } from './koiMock'

export const koi = new Web()
const eth = new Ethereum()
console.log('Finnie is waiting for instructions.')

const ports = {}
const permissionId = []
const createTransactionId = []
const sender = []

export const popupPorts = []

// AR balance stream
setInterval(() => {
  loadBalances(TYPE.ARWEAVE)
}, LOAD_BALANCES_TIME_INTERVAL)

// ETH balance stream
setInterval(() => {
  loadBalances(TYPE.ETHEREUM)
}, LOAD_ETH_BALANCES_TIME_INTERVAL)

// Transaction stream
setInterval(() => {
  updatePendingTransactions()
}, LOAD_TRANSACTION_STATE_INTERVAL)


function cb(port) {
  if ((port.name).includes(PORTS.POPUP)) {
    popupPorts.push(port)
    port.onDisconnect.addListener((disconnect) => {
      console.log('port disconnected--', disconnect, port)
      for (let i = 0; i < popupPorts.length; i++) {
        if (port.name === popupPorts[i].name) {
          popupPorts.splice(i, 1)
          break
        }
      }
    })

    port.onMessage.addListener((message) => {
      popUpEventHandlers(
        koi,
        port,
        message,
        ports,
        { permissionId, createTransactionId },
        eth
      )
    })
  }

  if ((port.name).includes(PORTS.CONTENT_SCRIPT)) {
    port.onMessage.addListener(message => {
      contentScriptEventHandlers(koi, port, message, ports, { permissionId, createTransactionId }, sender)
    })
  }
}

chrome.runtime.getPlatformInfo((info) => {
  window.localStorage.setItem(OS, info.os)
})
chrome.storage.local.remove('koiAddress')
chrome.runtime.onConnect.addListener(cb)
chrome.storage.local.remove('sitePermission')

chrome.runtime.onInstalled.addListener(async function () {
  const arweaveAccount = (await getChromeStorage(IMPORTED.ARWEAVE))[IMPORTED.ARWEAVE] || []
  const ethereumAccount = (await getChromeStorage(IMPORTED.ETHEREUM))[IMPORTED.ETHEREUM] || []
  if (!arweaveAccount.length && !ethereumAccount.length) chrome.tabs.create({ url: `${PATH.GALLERY}#/` })
})
