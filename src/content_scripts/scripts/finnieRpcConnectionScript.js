const finnieRpcConnectionScript = `() => {
  class FinnieRpcConnection extends EventEmitter {
    constructor() {
      super()
    }

    send(message) {
      return new Promise((resolve, reject) => {
        const id = Date.now()
        message.data.id = id
        window.postMessage({ type: message.type, data: message.data })
        this.once(message.type + '_SUCCESS', (data) => {
          if (data.id === id) resolve(data.responseData)
        })
        this.once(message.type + '_ERROR', (data) => {
          if (data.id === id) resolve(data.responseData)
        })
      })
    }
  }
  
  window.FinnieRpcConnection = FinnieRpcConnection
}`

export default finnieRpcConnectionScript
