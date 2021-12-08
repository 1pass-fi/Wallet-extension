import EventEmitter from 'events'
import { get, includes } from 'lodash'

import { MESSAGES } from 'constants/koiConstants'

import cache from 'background/cache'

export default class PopupEvents extends EventEmitter {
  sendMessage(endpoint, payload) {
    const { port } = payload
    const promise = new Promise((resolve) => {
      this.emit(endpoint, payload, resolve)
    })

    promise.then(result => {
      const twoStepEndpoints = [
        MESSAGES.HANDLE_CONNECT,
        MESSAGES.HANDLE_SIGN_TRANSACTION,
        MESSAGES.HANDLE_CREATE_DID
      ]

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

      if (includes(twoStepEndpoints, endpoint))
        this.#sendMessageToContentScript(result.data, result.status)
    })
  }

  #sendMessageToContentScript(messageData, status) {
    const isError = status !== 200
    const contentScriptPort = cache.getContentScriptPort()

    let data = { status, data: messageData }
    let endpoint = contentScriptPort.endpoint + '_SUCCESS'

    if (!includes(contentScriptPort.endpoint, 'KOI')) {
      if (isError) endpoint = contentScriptPort.endpoint + '_ERROR'
      data = messageData
    }

    contentScriptPort.port.postMessage({
      type: endpoint,
      data,
      id: contentScriptPort.id
    })
  }
}
