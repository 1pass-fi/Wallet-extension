const finnieEthereumProviderScript = `() => {
  class FinnieEthereumProvider extends EventEmitter {
    constructor(connection) {
      super()

      this.connection = connection
    }

    async request(message) {
      try {
        const response = await this.connection.send(message)
        return response
      } catch (err) {
        console.error('ERROR --- ', err.message)
      }
    }
  }

  window.FinnieEthereumProvider = FinnieEthereumProvider
}`

export default finnieEthereumProviderScript
