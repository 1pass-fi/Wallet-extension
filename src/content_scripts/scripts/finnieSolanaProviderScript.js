// TODO Thuan Ngo: window.solana

const finnieSolanaProviderScript = `() => {
  class FinnieSolanaProvider extends EventEmitter {
    constructor(connection) {
      super()
      this.connection = connection
      this.isConnected = false
      this.isFinnie = true
    }

    publicKey() {
      return 'example_public_key'
    }

    connect() {
      const message = { type: ENDPOINTS.SOLANA_CONNECT }
      return this.connection.send(message)
    }

    disconnect() {
      const message = { type: ENDPOINTS.SOLANA_DISCONNECT }
      return this.connection.send(message)
    }

    signAllTransactions() {
      const message = { type: ENDPOINTS.SOLANA_SIGN_ALL_TRANSACTIONS }
      return this.connection.send(message)
    }

    signTransaction() {
      const message = { type: ENDPOINTS.SOLANA_SIGN_TRANSACTION }
      return this.connection.send(message)
    }

    signMessage() {
      const message = { type: ENDPOINTS.SOLANA_SIGN_MESSAGE }
      return this.connection.send(message)
    }
  }

  window.FinnieSolanaProvider = FinnieSolanaProvider
}`

export default finnieSolanaProviderScript
