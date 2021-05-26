import '@babel/polyfill'

import { BackgroundConnect, EventHandler } from 'utils/backgroundConnect'
import { PORTS, MESSAGES } from 'koiConstants'

console.log('Content scripts has loaded')

const messageTypes = [
  MESSAGES.GET_ADDRESS_SUCCESS,
  MESSAGES.GET_ADDRESS_ERROR,
  MESSAGES.GET_PERMISSION_SUCCESS,
  MESSAGES.GET_PERMISSION_ERROR,
  MESSAGES.CREATE_TRANSACTION_SUCCESS,
  MESSAGES.CREATE_TRANSACTION_ERROR,
]
export const backgroundConnect = new BackgroundConnect(PORTS.CONTENT_SCRIPT)
messageTypes.forEach(messageType => {
  backgroundConnect.addHandler(new EventHandler(messageType, (message) => {
    window.postMessage(message)
  }))
})

window.addEventListener('message', function (event) {
  switch (event.data.type) {
    case MESSAGES.GET_ADDRESS:
      backgroundConnect.postMessage({ type: event.data.type })
      break
    case MESSAGES.GET_PERMISSION:
      backgroundConnect.postMessage({ type: event.data.type, data: event.data.data })
      break
    case MESSAGES.CREATE_TRANSACTION:
      backgroundConnect.postMessage({ type: event.data.type, data: event.data.data })
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
      const promise = new Promise((resolve, reject) => {
        window.postMessage({ type: messageType, data })
        promiseResolves[messageType + '_SUCCESS'].push(resolve)
        promiseResolves[messageType + '_ERROR'].push(reject)
      })
      return promise
    }

    window.koi = {
      getAddress: () => buildPromise(MESSAGE_TYPES.GET_ADDRESS),
      getPermission: () => buildPromise(MESSAGE_TYPES.GET_PERMISSION),
      signTransaction: (qty, address) => buildPromise(MESSAGE_TYPES.CREATE_TRANSACTION, { qty, address })
    }
    window.addEventListener('message', function (event) {
      if (!event.data || !event.data.type) {
        return
      }
      if (promiseResolves[event.data.type]) {
        promiseResolves[event.data.type].forEach(resolve => resolve(event))
        promiseResolves[event.data.type] = []
        const pairMessageType = event.data.type.endsWith('_SUCCESS') ? event.data.type.replace(/_SUCCESS$/g, '_ERROR') : event.data.type.replace(/_ERROR$/g, '_SUCCESS')
        if (pairMessageType !== event.data.type && promiseResolves[pairMessageType]) {
          promiseResolves[pairMessageType] = []
        }
      }
    })
  }

  function inject(fn) {
    const script = document.createElement('script')
    const { GET_ADDRESS, GET_PERMISSION, CREATE_TRANSACTION } = messages
    const pickedMessages = {
      GET_ADDRESS,
      GET_PERMISSION,
      CREATE_TRANSACTION
    }
    script.text = `const MESSAGE_TYPES = JSON.parse('${JSON.stringify(pickedMessages)}');(${fn.toString()})();`
    document.documentElement.appendChild(script)
  }

  inject(script)
})(MESSAGES)
