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

  window.FinnieEthereumProvider = FinnieEthereumProvider
}

export default '() => {\n  class FinnieEthereumProvider extends EventEmitter {\n    constructor(connection) {\n      super()\n\n      this.connection = connection\n    }\n\n    async request(message) {\n      try {\n        const response = await this.connection.send(message)\n        console.log(\'RESPONSE\', response)\n      } catch (err) {\n        console.error(\'ERROR --- \', err.message)\n      }\n    }\n  }\n\n  window.FinnieEthereumProvider = FinnieEthereumProvider\n}'
