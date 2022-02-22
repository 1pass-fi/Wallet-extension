const finnieArweaveProviderScript = `() => {
  class FinnieArweaveProvider {
    constructor(connection) {
      this.connection = connection
    }

    getActiveAddress() {
      const message = { type: ENDPOINTS.GET_ADDRESS }
      return this.connection.send(message)
    }

    getAddress() {
      const message = { type: ENDPOINTS.GET_ADDRESS }
      return this.connection.send(message)
    }

    getPermission() {
      const message = { type: ENDPOINTS.GET_PERMISSION }
      return this.connection.send(message)
    }

    connect() {
      const message = { type: ENDPOINTS.CONNECT }
      return this.connection.send(message)
    }

    sign(transaction) {
      let plainTransaction = {
        data: transaction.data ? JSON.stringify(transaction.data): null,
        data_root: transaction.data_root,
        tags: transaction.tags,
        quantity: transaction.quantity,
        data_size: transaction.data_size,
        target: transaction.target
      }

      const message = { type: ENDPOINTS.CREATE_TRANSACTION, data: { transaction: plainTransaction } }
      return this.connection.send(message)
    }

    getWalletNames() {
      const message = { type: ENDPOINTS.GET_WALLET_NAMES }
      return this.connection.send(message)
    }

    getAllAddresses() {
      const message = { type: ENDPOINTS.GET_ALL_ADDRESSES }
      return this.connection.send(message)
    }

    disconnect() {
      const message = { type: ENDPOINTS.DISCONNECT }
      return this.connection.send(message)
    }

    getActivePublicKey() {
      const message = { type: ENDPOINTS.GET_PUBLIC_KEY }
      return this.connection.send(message)
    }

    signature(hashBuffer, algorithm) {
      const message = { type: ENDPOINTS.SIGNATURE, data: { hashBuffer, algorithm } }
      return this.connection.send(message)
    }
  }

  window.FinnieArweaveProvider = FinnieArweaveProvider
}`

export default finnieArweaveProviderScript
