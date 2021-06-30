import '@babel/polyfill'

import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { PORTS, MESSAGES } from 'koiConstants'
import { setChromeStorage } from 'utils'
import { get } from 'lodash'

console.log('Content scripts has loaded')

const messageTypes = [
  MESSAGES.GET_ADDRESS_SUCCESS,
  MESSAGES.GET_ADDRESS_ERROR,
  MESSAGES.GET_PERMISSION_SUCCESS,
  MESSAGES.GET_PERMISSION_ERROR,
  MESSAGES.CREATE_TRANSACTION_SUCCESS,
  MESSAGES.CREATE_TRANSACTION_ERROR,
  MESSAGES.CONNECT_SUCCESS,
  MESSAGES.CONNECT_ERROR,
  MESSAGES.KOI_GET_ADDRESS_SUCCESS,
  MESSAGES.KOI_GET_ADDRESS_ERROR,
  MESSAGES.KOI_GET_PERMISSION_SUCCESS,
  MESSAGES.KOI_GET_PERMISSION_ERROR,
  MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
  MESSAGES.KOI_CREATE_TRANSACTION_ERROR,
  MESSAGES.KOI_CONNECT_SUCCESS,
  MESSAGES.KOI_CONNECT_ERROR,
  MESSAGES.KOI_DISCONNECT_SUCCESS,
  MESSAGES.KOI_DISCONNECT_ERROR,
  MESSAGES.KOI_REGISTER_DATA_SUCCESS,
  MESSAGES.KOI_REGISTER_DATA_ERROR
]
export const backgroundConnect = new BackgroundConnect(PORTS.CONTENT_SCRIPT)
messageTypes.forEach(messageType => {
  backgroundConnect.addHandler(new EventHandler(messageType, (message) => {
    window.postMessage(message)
  }))
})

window.addEventListener('message', async function (event) {
  let transaction, data
  switch (event.data.type) {
    case MESSAGES.GET_ADDRESS:
    case MESSAGES.GET_PERMISSION:
    case MESSAGES.CREATE_TRANSACTION:
    case MESSAGES.CONNECT:
    case MESSAGES.KOI_GET_ADDRESS:
    case MESSAGES.KOI_GET_PERMISSION:
    case MESSAGES.KOI_CONNECT:
    case MESSAGES.KOI_DISCONNECT:
    case MESSAGES.KOI_REGISTER_DATA:
      backgroundConnect.postMessage(event.data)
      break
    case MESSAGES.KOI_CREATE_TRANSACTION:
      transaction = get(event, 'data.data.transaction')
      data = transaction.data
      await setChromeStorage({ 'transactionData': data })
      event.data.data.transaction.data = []
      backgroundConnect.postMessage(event.data)
      break
    default:
      break
  }
})

; (function (messages) {
  function script() {
    const promiseResolves = {}
    Object.values(MESSAGE_TYPES).forEach(messageType => {
      promiseResolves[`${messageType}_SUCCESS`] = []
      promiseResolves[`${messageType}_ERROR`] = []
    })

    function buildPromise(messageType, data) {
      if (!(window.origin).includes('chrome-extension')) {
        const id = `${messageType}-${Date.now()}`
        const promise = new Promise((resolve, reject) => {
          window.postMessage({ type: messageType, data, id })
          promiseResolves[messageType + '_SUCCESS'].push({ resolve, id })
          promiseResolves[messageType + '_ERROR'].push({ resolve: reject, id })
        })
        return promise
      }
    }

    window.arweaveWallet = {
      getAddress: () => buildPromise(MESSAGE_TYPES.GET_ADDRESS),
      getPermissions: () => buildPromise(MESSAGE_TYPES.GET_PERMISSION),
      connect: () => buildPromise(MESSAGE_TYPES.CONNECT),
      sign: (transaction) => buildPromise(MESSAGE_TYPES.CREATE_TRANSACTION, { transaction })
    }
    window.koiWallet = {
      getAddress: () => buildPromise(MESSAGE_TYPES.KOI_GET_ADDRESS),
      getPermissions: () => buildPromise(MESSAGE_TYPES.KOI_GET_PERMISSION),
      connect: () => buildPromise(MESSAGE_TYPES.KOI_CONNECT),
      sign: (transaction) => buildPromise(MESSAGE_TYPES.KOI_CREATE_TRANSACTION, { transaction }),
      disconnect: () => buildPromise(MESSAGE_TYPES.KOI_DISCONNECT),
      registerData: (txId) => buildPromise(MESSAGE_TYPES.KOI_REGISTER_DATA, { txId })
    }
    window.addEventListener('message', function (event) {
      // console.log('EVENT', event)
      // console.log({ promiseResolves })
      if (!event.data || !event.data.type) {
        return
      }
      if (promiseResolves[event.data.type]) {
        promiseResolves[event.data.type].forEach(({ id, resolve }) => {
          console.log('EVENT FROM KOII EXTENSION: ', id)
          if (id === event.data.id) {
            resolve(event.data.data)
          }
        })
        promiseResolves[event.data.type] = promiseResolves[event.data.type].filter(({ id }) => id !== event.data.id)
        const pairMessageType = event.data.type.endsWith('_SUCCESS') ? event.data.type.replace(/_SUCCESS$/g, '_ERROR') : event.data.type.replace(/_ERROR$/g, '_SUCCESS')
        if (pairMessageType !== event.data.type && promiseResolves[pairMessageType]) {
          promiseResolves[pairMessageType] = promiseResolves[pairMessageType].filter(({ id }) => id !== event.data.id)
        }
      }
    })
  }

  function inject(fn) {
    const script = document.createElement('script')
    const arweaveScript = document.createElement('script')
    const {
      GET_ADDRESS,
      GET_PERMISSION,
      CREATE_TRANSACTION,
      CONNECT,
      KOI_GET_ADDRESS,
      KOI_GET_PERMISSION,
      KOI_CREATE_TRANSACTION,
      KOI_CONNECT,
      KOI_DISCONNECT,
      KOI_REGISTER_DATA
    } = messages
    const pickedMessages = {
      GET_ADDRESS,
      GET_PERMISSION,
      CREATE_TRANSACTION,
      CONNECT,
      KOI_GET_ADDRESS,
      KOI_GET_PERMISSION,
      KOI_CREATE_TRANSACTION,
      KOI_CONNECT,
      KOI_DISCONNECT,
      KOI_REGISTER_DATA
    }
    script.text = `const MESSAGE_TYPES = JSON.parse('${JSON.stringify(pickedMessages)}');(${fn.toString()})();`
    arweaveScript.src = 'https://unpkg.com/arweave/bundles/web.bundle.js'

    document.documentElement.appendChild(arweaveScript)
    document.documentElement.appendChild(script)
    // setTimeout(() => {
      
    // }, 2000)
  }

  inject(script)
})(MESSAGES)
