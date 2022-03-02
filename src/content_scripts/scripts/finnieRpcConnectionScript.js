const finnieRpcConnectionScript = `() => {
  class FinnieRpcConnection extends EventEmitter {
    constructor() {
      super()
    }

    send(message) {
      return new Promise((resolve, reject) => {
        const id = Date.now()
        window.postMessage({ type: message.type, data: message.data, id })
        this.once(message.type + '_SUCCESS', (response) => {
          if (response.id === id) resolve(response.data)
        })
        this.once(message.type + '_ERROR', (response) => {
          if (response.id === id) resolve(response.data)
        })
      })
    }
  }
  
  window.FinnieRpcConnection = FinnieRpcConnection
}`

export default finnieRpcConnectionScript
