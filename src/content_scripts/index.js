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
    case MESSAGES.GET_PERMISSION:
    case MESSAGES.CREATE_TRANSACTION:
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
        const id = `${messageType}-${Date.now()}`
        const promise = new Promise((resolve, reject) => {
          window.postMessage({ type: messageType, data, id })
          promiseResolves[messageType + '_SUCCESS'].push({ resolve, id })
          promiseResolves[messageType + '_ERROR'].push({ resolve: reject, id })
        })
        return promise
      }

      window.arweaveWallet = {
        getAddress: () => buildPromise(MESSAGE_TYPES.GET_ADDRESS),
        getPermissions: () => buildPromise(MESSAGE_TYPES.GET_PERMISSION),
        connect: () => new Promise(() => { }),
        sign: (qty, address) => buildPromise(MESSAGE_TYPES.CREATE_TRANSACTION, { qty, address })
      }
      window.addEventListener('message', function (event) {
        if (!event.data || !event.data.type) {
          return
        }
        if (promiseResolves[event.data.type]) {
          promiseResolves[event.data.type].forEach(({ id, resolve }) => {
            if (id === event.data.id) {
              resolve(event.data.data)
            }
          })
          promiseResolves[event.data.type] = []
          const pairMessageType = event.data.type.endsWith('_SUCCESS') ? event.data.type.replace(/_SUCCESS$/g, '_ERROR') : event.data.type.replace(/_ERROR$/g, '_SUCCESS')
          if (pairMessageType !== event.data.type && promiseResolves[pairMessageType]) {
            promiseResolves[pairMessageType].filter(({ id }) => id !== event.data.id)
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
