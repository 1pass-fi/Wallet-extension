const finnieRpcConnectionScript = `() => {
  class FinnieRpcConnection extends EventEmitter {
    constructor() {
      super()

      this.resolve = {'TEST_ETHEREUM': null}
      this.reject = {'TEST_ETHEREUM': null}
    }

    send(message) {
      return new Promise((resolve, reject) => {
        window.postMessage({ type: 'TEST_ETHEREUM', data: 'TEST FROM CLIENT' })
        this.resolve['TEST_ETHEREUM'] = resolve
        this.reject['TEST_ETHEREUM'] = reject
      })
    }
  }

  window.FinnieRpcConnection = FinnieRpcConnection
  window.connection = new FinnieRpcConnection()

  window.addEventListener('message', function(event) {
    console.log('EVENT DATA', event.data)
    window.connection.resolve['TEST_ETHEREUM'](event.data.data)
  })
}`

export default finnieRpcConnectionScript
