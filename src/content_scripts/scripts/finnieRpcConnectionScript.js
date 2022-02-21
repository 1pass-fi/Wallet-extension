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

  window.FinnieRpcConnection = FinnieRpcConnection
}

export default '() => {\n  class FinnieRpcConnection extends EventEmitter {\n    constructor() {\n      super()\n\n      // array to store resolve, reject functions\n      this.resolve = {\'TEST_ETHEREUM\': null}\n      this.reject = {\'TEST_ETHEREUM\': null}\n    }\n\n    send(message) {\n      return new Promise((resolve, reject) => {\n        window.postMessage({ type: \'TEST_ETHEREUM\', data: \'TEST\' })\n        this.resolve[\'TEST_ETHEREUM\'] = resolve\n        this.reject[\'TEST_ETHEREUM\'] = reject\n      })\n    }\n  }\n\n  window.FinnieRpcConnection = FinnieRpcConnection\n}'
