const finnieRpcConnectionScript = `() => {
  class FinnieRpcConnection extends EventEmitter {
    constructor() {
      super()
    }

    send(message) {
      return new Promise((resolve, reject) => {
        window.postMessage({ type: message.type, data: message.data })
        this.once(message.type + '_SUCCESS', resolve)
        this.once(message.type + '_ERROR', reject)
      })
    }
  }

  window.connection = new FinnieRpcConnection()

  window.addEventListener('message', function(event) {
    try {
      window.connection.emit(event.data.type, event.data.data)
    } catch (err) {

    }
  })
}`

export default finnieRpcConnectionScript
