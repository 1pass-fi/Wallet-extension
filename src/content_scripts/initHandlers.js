import '@babel/polyfill'

import { EventHandler } from 'services/request/src/backgroundConnect'
import { contentBackgroundConnect as backgroundConnect } from 'services/request/contentScript'
import { MESSAGES } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'


import storage from 'services/storage'

export default async () => {
  const messageTypes = [
    MESSAGES.GET_ADDRESS_SUCCESS,
    MESSAGES.GET_ADDRESS_ERROR,
    MESSAGES.GET_PERMISSION_SUCCESS,
    MESSAGES.GET_PERMISSION_ERROR,
    MESSAGES.CREATE_TRANSACTION_SUCCESS,
    MESSAGES.CREATE_TRANSACTION_ERROR,
    MESSAGES.CONNECT_SUCCESS,
    MESSAGES.CONNECT_ERROR,
    MESSAGES.KOI_GET_ADDRESS_SUCCESS,
    MESSAGES.KOI_GET_ADDRESS_ERROR,
    MESSAGES.KOI_GET_PERMISSION_SUCCESS,
    MESSAGES.KOI_GET_PERMISSION_ERROR,
    MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
    MESSAGES.KOI_CREATE_TRANSACTION_ERROR,
    MESSAGES.KOI_CONNECT_SUCCESS,
    MESSAGES.KOI_CONNECT_ERROR,
    MESSAGES.KOI_DISCONNECT_SUCCESS,
    MESSAGES.KOI_DISCONNECT_ERROR,
    MESSAGES.KOI_REGISTER_DATA_SUCCESS,
    MESSAGES.KOI_REGISTER_DATA_ERROR,
    MESSAGES.GET_ALL_ADDRESSES_SUCCESS,
    MESSAGES.GET_ALL_ADDRESSES_ERROR,
    MESSAGES.GET_WALLET_NAMES_SUCCESS,
    MESSAGES.GET_WALLET_NAMES_ERROR,
    MESSAGES.DISCONNECT_SUCCESS,
    MESSAGES.DISCONNECT_ERROR,
    MESSAGES.GET_PUBLIC_KEY_SUCCESS,
    MESSAGES.GET_PUBLIC_KEY_ERROR,
    MESSAGES.KOI_SIGN_PORT_SUCCESS,
    MESSAGES.KOI_SIGN_PORT_ERROR,
    MESSAGES.KOI_SEND_KOI_SUCCESS,
    MESSAGES.KOI_SEND_KOI_ERROR,
    MESSAGES.CREATE_DID_SUCCESS,
    MESSAGES.CREATE_DID_ERROR,
    MESSAGES.ERROR
  ]
  
  /* 
    Add handlers for contentBackgroundConnect:
      - Receive response from background -> forward resposne to client page
  */
  messageTypes.forEach(messageType => {
    backgroundConnect.addHandler(new EventHandler(messageType, (message) => {
      window.postMessage(message)
    }))
  })
  
  /* 
    Add handlers for 'message' event:
      - Receive message from client page -> forward message to background
  */
  window.addEventListener('message', async function (event) {
    switch (event.data.type) {
      case MESSAGES.GET_ADDRESS:
      case MESSAGES.GET_PERMISSION:
      case MESSAGES.CONNECT:
      case MESSAGES.KOI_GET_ADDRESS:
      case MESSAGES.KOI_GET_PERMISSION:
      case MESSAGES.KOI_CONNECT:
      case MESSAGES.KOI_DISCONNECT:
      case MESSAGES.KOI_REGISTER_DATA:
      case MESSAGES.GET_ALL_ADDRESSES:
      case MESSAGES.GET_WALLET_NAMES:
      case MESSAGES.DISCONNECT:
      case MESSAGES.GET_PUBLIC_KEY:
      case MESSAGES.KOI_SIGN_PORT:
      case MESSAGES.KOI_SEND_KOI:
      case MESSAGES.CREATE_DID:
        backgroundConnect.postMessage(event.data)
        break
      case MESSAGES.KOI_CREATE_TRANSACTION:
      case MESSAGES.CREATE_TRANSACTION:
        /* 
          The Chrome tool doesn't allow sending message with big data.
          Save data of transaction to Chrome storage.
        */
        await saveTransactionData(event)
        
        backgroundConnect.postMessage(event.data)
        break
      default:
        break
    }
  })
}

const saveTransactionData = async (event) => {
  // check for hasPendingRequest
  const pendingRequest = await storage.generic.get.pendingRequest()
  const hasPendingRequest = !isEmpty(pendingRequest)

  if (hasPendingRequest) return

  const transaction = get(event, 'data.data.transaction')
  console.log('Sending transaction to Finnie...')
  const data = transaction.data || null

  await storage.generic.set.transactionData({ data, id: event.data.id })

  event.data.data.transaction.data = []
}
