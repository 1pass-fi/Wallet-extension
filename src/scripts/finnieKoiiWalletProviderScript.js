const finnieKoiiWalletProviderScript = () => {
  class FinnieKoiiWalletProvider {
    constructor(connection) {
      this.connection = connection
    }

    getAddress() {
      const message = { type: ENDPOINTS.KOI_GET_ADDRESS }
      return this.connection.send(message)
    }

    getPermissions() {
      const message = { type: ENDPOINTS.KOI_GET_PERMISSION }
      return this.connection.send(message)
    }

    connect() {
      const message = { type: ENDPOINTS.KOI_CONNECT }
      return this.connection.send(message)
    }

    sign(transaction) {
      let plainTransaction = {
        data: transaction.data ? JSON.stringify(transaction.data) : null,
        data_root: transaction.data_root,
        tags: transaction.tags,
        quantity: transaction.quantity,
        data_size: transaction.data_size,
        target: transaction.target
      }

      const message = { type: ENDPOINTS.KOI_CREATE_TRANSACTION, data: { transaction: plainTransaction } }
      return this.connection.send(message).then((response) => {
        const signedTransaction = response
        if (response.signature) {
          transaction.setSignature({
            id: signedTransaction.id,
            owner: signedTransaction.owner,
            tags: signedTransaction.tags,
            signature: signedTransaction.signature,
          })
        }

        return {data: response}
      })
    }

    disconnect() {
      const message = { type: ENDPOINTS.KOI_DISCONNECT }
      return this.connection.send(message)
    }

    registerData(txId) {
      const message = { type: ENDPOINTS.KOI_REGISTER_DATA, data: { txId } }
      return this.connection.send(message)
    }

    signPort(txId) {
      const message = { type: ENDPOINTS.KOI_SIGN_PORT, data: { txId } }
      return this.connection.send(message)
    }

    sendKoii(target, qty) {
      const message = { type: ENDPOINTS.KOI_SEND_KOI, data: { target, qty } }
      return this.connection.send(message)
    }

    createDID(didData) {
      const message = { type: ENDPOINTS.KOI_CREATE_DID, data: { didData } }
      return this.connection.send(message)
    }

    updateDID(didData, txId, newkID) {
      const message = { type: ENDPOINTS.KOI_UPDATE_DID, data: { didData, txId, newkID } }
      return this.connection.send(message)
    }
  }

  window.FinnieKoiiWalletProvider = FinnieKoiiWalletProvider
}

finnieKoiiWalletProviderScript()
