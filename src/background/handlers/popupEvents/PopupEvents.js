import EventEmitter from 'events'
import { get } from 'lodash'

import { MESSAGES } from 'constants/koiConstants'

export default class PopupEvents extends EventEmitter {
  sendMessage(endpoint, payload) {
    const { port } = payload
    const promise = new Promise((resolve) => {
      this.emit(endpoint, payload, resolve)
    })

    promise.then(result => {
      if (get(result, 'error')) {
        port.postMessage({
          type: endpoint,
          error: get(result, 'error'),
          id: payload.id
        })
      } else {
        if (endpoint !== MESSAGES.GET_BALANCES) {
          port.postMessage({
            type: endpoint,
            data: get(result, 'data'),
            id: payload.id
          })
        }
        if (endpoint === MESSAGES.UPLOAD_NFT) {
          port.postMessage({
            type: `${endpoint}_SUCCESS`,
            data: get(result, 'data'),
            id: payload.id
          })
        }
      }
    })
  }
}
