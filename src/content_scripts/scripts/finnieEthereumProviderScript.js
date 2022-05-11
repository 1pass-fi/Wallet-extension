const finnieEthereumProviderScript = `() => {
  class FinnieEthereumProvider extends EventEmitter {
    constructor(connection) {
      super()
      this.connection = connection
      this.isFinnie = true
    }

    request(payload) {
      const message = {
        type: ENDPOINTS.ETHEREUM_RPC_REQUEST,
        data: payload
      }
      return this.connection.send(message)
    }
  }

  window.FinnieEthereumProvider = FinnieEthereumProvider
}`

export default finnieEthereumProviderScript
