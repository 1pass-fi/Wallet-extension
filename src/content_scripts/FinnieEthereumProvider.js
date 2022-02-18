const finnieEthereumProviderScript = () => {
  class FinnieEthereumProvider extends EventEmitter {
    constructor(connection) {
      super()

      this.connection = connection
    }

    async request(message) {
      try {
        const response = await this.connection.send(message)
        console.log('RESPONSE', response)
      } catch (err) {
        console.error('ERROR --- ', err.message)
      }
    }
  }
}

export default finnieEthereumProviderScript
