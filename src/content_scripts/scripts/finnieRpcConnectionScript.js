const finnieRpcConnectionScript = `() => {
  class FinnieRpcConnection extends EventEmitter {
    constructor() {
      super()
    }

    send(message) {
      return new Promise((resolve, reject) => {
        const id = Date.now() * Math.random()
        window.postMessage({ type: message.type, data: message.data, id })
        this.once(message.type + '_SUCCESS' + '_' + id, (response) => {
          if (response.id === id) resolve(response.data)
        })
        this.once(message.type + '_ERROR'  + '_' + id, (response) => {
          if (response.id === id) reject(response.data)
        })
      })
    }
  }
  
  window.FinnieRpcConnection = FinnieRpcConnection
}`

export default finnieRpcConnectionScript
