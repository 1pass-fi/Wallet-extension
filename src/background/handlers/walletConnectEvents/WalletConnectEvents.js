// Constants
import EventEmitter from 'events'
import { isError } from 'joi'
import { get } from 'lodash'
import walletConnect from 'services/walletConnect'

export default class WalletConnectEvents extends EventEmitter {
  async sendMessage(endpoint, payload) {
    const metadata = this.getMetadata()
    const promise = new Promise((resolve) => {
      this.emit(endpoint, payload, metadata, resolve)
    })

    promise.then((result) => {
      if (get(result, 'error')) {
        walletConnect.response({ id: payload.id, data: result.error, topic: payload.topic }, true)
      } else {
        walletConnect.response({
          id: payload.id,
          data: result.data,
          topic: payload.topic
        })
      }
    })
  }

  getMetadata() {
    return {
      name: 'example_name'
    }
  }
}
