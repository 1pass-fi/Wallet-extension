import EventEmitter from 'events'
import { get } from 'lodash'

import { MESSAGES } from 'constants/koiConstants'

// controllers
import controller from './controller'

class PopupEvents extends EventEmitter {
  sendMessage(endpoint, payload) {
    const { port } = payload
    const promise = new Promise((resolve) => {
      this.emit(endpoint, payload, resolve)
    })

    promise.then(result => {
      if (get(result, 'error')) {
        port.postMessage({
          type: endpoint,
          error: result.error,
          id: payload.id
        })
      } else {
        if (endpoint !== MESSAGES.GET_BALANCES) {
          port.postMessage({
            type: endpoint,
            data: result.data,
            id: payload.id
          })
        }
      }
    })
  }
}

const getEmitter = () => {
  const popupEvents = new PopupEvents()

  popupEvents.on(MESSAGES.GET_BALANCES, controller.getBalance)
  popupEvents.on(MESSAGES.IMPORT_WALLET, controller.importWallet)

  return popupEvents
}

export default getEmitter()
