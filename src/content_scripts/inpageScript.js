/* 
  This script will be injected into client page
*/

export default () => {
  const promiseResolves = {}
  Object.values(MESSAGE_TYPES).forEach(messageType => {
    promiseResolves[`${messageType}_SUCCESS`] = []
    promiseResolves[`${messageType}_ERROR`] = []
  })

  function buildPromise(messageType, data) {
    if (!(window.origin).includes('chrome-extension')) {
      const id = `${messageType}-${Date.now()}`
      const promise = new Promise((resolve, reject) => {
        window.postMessage({ type: messageType, data, id })
        promiseResolves[messageType + '_SUCCESS'].push({ resolve, id })
        promiseResolves[messageType + '_ERROR'].push({ resolve: reject, id })
      })
      return promise
    }
  }

  window.arweaveWallet = {
    getActiveAddress: () => {
      return buildPromise(MESSAGE_TYPES.GET_ADDRESS)
    },
    getAddress: () => {
      return buildPromise(MESSAGE_TYPES.GET_ADDRESS)
    },
    getPermissions: () => {
      return buildPromise(MESSAGE_TYPES.GET_PERMISSION)
    },
    connect: () => buildPromise(MESSAGE_TYPES.CONNECT),
    sign: (transaction) => {
      let plainTransaction = {
        data: transaction.data ? JSON.stringify(transaction.data): null,
        data_root: transaction.data_root,
        tags: transaction.tags,
        quantity: transaction.quantity,
        data_size: transaction.data_size,
      }
      return buildPromise(MESSAGE_TYPES.CREATE_TRANSACTION, { transaction: plainTransaction })
    },
    getWalletNames: () => buildPromise(MESSAGE_TYPES.GET_WALLET_NAMES),
    getAllAddresses: () => {
      return buildPromise(MESSAGE_TYPES.GET_ALL_ADDRESSES)
    },
    disconnect: () => buildPromise(MESSAGE_TYPES.DISCONNECT),
    getActivePublicKey: () => buildPromise(MESSAGE_TYPES.GET_PUBLIC_KEY),
  }

  window.koii = {
    arweaveWallet: window.arweaveWallet,
    koiiWallet: window.koiWallet
  }

  /* 
    When the user doesn't have permission to: getAddress, sign, registerData, signPort, sendKoii; they will receive:
      { status: 401, data: 'Do not have permissions. }
    (basically they will need to connect to Finnie to perform these actions)
  */
  window.koiiWallet = {
    /**
       * getAddress
       * @returns {Object} { status: 200, data: address }
       * @returns {Object} { status: 404, data: 'Address not found' }
       */
    getAddress: () => buildPromise(MESSAGE_TYPES.KOI_GET_ADDRESS),
      
    /**
       * getPermissions
       * @returns {Object} {status: 200, data: [                  
                  'SIGN_TRANSACTION', 
                  'ACCESS_ADDRESS', 
                  'ACCESS_PUBLIC_KEY',
                  'ACCESS_ALL_ADDRESSES',
                  'ENCRYPT',
                  'DECRYPT',
                  'SIGNATURE',
                  'ACCESS_ARWEAVE_CONFIG']}
        * @returns {Object} {status: 401, data: []}
       */
    getPermissions: () => buildPromise(MESSAGE_TYPES.KOI_GET_PERMISSION),

    /**
       * connect
       * @returns {Object} { status: 200, data: 'Connected.' }
       * @returns {Object} { status: 401, data: 'Please import your wallet.'} (This will be returned when Finnie doesn't have any imported wallet)
       * @returns {Object} { status: 401, data: 'Connection rejected' } (When user reject the conecting request, or close Finnie window)
       */
    connect: () => buildPromise(MESSAGE_TYPES.KOI_CONNECT),

    /**
       * sign
       * @param {Transaction} transaction 
       * @returns {Object} { status: 200 } (On sign succeeded, the inputted transaction will be signed)
       * @returns {Object} { status: 403, data: 'Transaction rejected.' }
       */
    sign: (transaction) => {
      // create a plainTransaction
      let plainTransaction = {
        data: transaction.data ? JSON.stringify(transaction.data) : null,
        data_root: transaction.data_root,
        tags: transaction.tags,
        quantity: transaction.quantity,
        data_size: transaction.data_size,
        target: transaction.target
      }

      return buildPromise(MESSAGE_TYPES.KOI_CREATE_TRANSACTION, { transaction: plainTransaction })
        .then((response) => {
          const signedTransaction = response.data   

          if (response.data.signature) {
            transaction.setSignature({
              id: signedTransaction.id,
              owner: signedTransaction.owner,
              tags: signedTransaction.tags,
              signature: signedTransaction.signature,
            })
          }
  
          return response
        })
    } ,

    /**
       * disconnect
       * @returns {Object} { status: 200, data: 'Disconnected.' }
       */
    disconnect: () => buildPromise(MESSAGE_TYPES.KOI_DISCONNECT),

    /**
       * registerData
       * @param {String} txId 
       * @returns {Object} { status: 200, data: txId } (transaction ID of register transaction)
       */
    registerData: (txId) => buildPromise(MESSAGE_TYPES.KOI_REGISTER_DATA, { txId }),

    /**
       * signPort
       * @param {*} txId 
       * @returns {Object} { status: 200, data: { request-public-key, x-request-signature } }
       */
    signPort: (txId) => buildPromise(MESSAGE_TYPES.KOI_SIGN_PORT, { txId }),

    /**
       * sendKoii
       * @param {String} target Recipient address
       * @param {Number} qty 
       * @returns {Object} { status: 200, data: txId } (return the transaction id of the sendKoii transaction)
       */
    sendKoii: (target, qty) => buildPromise(MESSAGE_TYPES.KOI_SEND_KOI, { target, qty }),
    
    /**
     * createDID
     * @param {*} didData 
     * @returns 
     */
    createDID: (didData) => buildPromise(MESSAGE_TYPES.KOI_CREATE_DID, { didData }),

    /**
     * 
     * @param {*} didData 
     * @param {*} txId 
     * @returns 
     */
    updateDID: (didData, txId) => buildPromise(MESSAGE_TYPES.KOI_UPDATE_DID, { didData, txId, newKID })
  }

  window.koiWallet = window.koiiWallet

  window.addEventListener('message', function (event) {
    // console.log('EVENT', event)
    if (!event.data || !event.data.type) {
      return
    }

    if (event.data.type == 'ERROR') {
      const keys = Object.keys(promiseResolves)
      keys.forEach(key => {
        if (key.includes('ERROR') && promiseResolves[key].length > 0 ) {
          promiseResolves[key].forEach(r => {
            const { resolve } = r
            resolve('Something went wrong. Please try to refresh the page.')
          })
        }
        promiseResolves[key].length = 0
      })
    }

    if (promiseResolves[event.data.type]) {
      promiseResolves[event.data.type].forEach(({ id, resolve }) => {
        console.log('Finnie event: ', id)
        if (id === event.data.id) {
          resolve(event.data.data)
        }
      })
      promiseResolves[event.data.type] = promiseResolves[event.data.type].filter(({ id }) => id !== event.data.id)
      const pairMessageType = event.data.type.endsWith('_SUCCESS') ? event.data.type.replace(/_SUCCESS$/g, '_ERROR') : event.data.type.replace(/_ERROR$/g, '_SUCCESS')
      if (pairMessageType !== event.data.type && promiseResolves[pairMessageType]) {
        promiseResolves[pairMessageType] = promiseResolves[pairMessageType].filter(({ id }) => id !== event.data.id)
      }
    }
  })
}
