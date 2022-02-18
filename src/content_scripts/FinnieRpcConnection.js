const finnieRpcConnectionScript = () => {
  class FinnieRpcConnection extends EventEmitter {
    constructor() {
      super()

      // array to store resolve, reject functions
      this.resolve = {'TEST_ETHEREUM': null}
      this.reject = {'TEST_ETHEREUM': null}
    }

    send(message) {
      return new Promise((resolve, reject) => {
        window.postMessage({ type: 'TEST_ETHEREUM', data: 'TEST' })
        this.resolve['TEST_ETHEREUM'] = resolve
        this.reject['TEST_ETHEREUM'] = reject
      })
    }
  }
}
