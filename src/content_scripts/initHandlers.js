import '@babel/polyfill'

import { MESSAGES } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'
import { contentBackgroundConnect as backgroundConnect } from 'services/request/contentScript'
import { EventHandler } from 'services/request/src/backgroundConnect'
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
    MESSAGES.KOI_CREATE_DID_SUCCESS,
    MESSAGES.KOI_CREATE_DID_ERROR,
    MESSAGES.KOI_UPDATE_DID_SUCCESS,
    MESSAGES.KOI_UPDATE_DID_ERROR,
    MESSAGES.SIGNATURE_SUCCESS,
    MESSAGES.SIGNATURE_ERROR,
    MESSAGES.ERROR,
    MESSAGES.TEST_ETHEREUM_SUCCESS,
    MESSAGES.TEST_ETHEREUM_ERROR,
    MESSAGES.ETHEREUM_RPC_REQUEST_SUCCESS,
    MESSAGES.ETHEREUM_RPC_REQUEST_ERROR,
    MESSAGES.SOLANA_CONNECT_SUCCESS,
    MESSAGES.SOLANA_CONNECT_ERROR,
    MESSAGES.SOLANA_DISCONNECT_SUCCESS,
    MESSAGES.SOLANA_DISCONNECT_ERROR,
    MESSAGES.SOLANA_SIGN_ALL_TRANSACTIONS_SUCCESS,
    MESSAGES.SOLANA_SIGN_ALL_TRANSACTIONS_ERROR,
    MESSAGES.SOLANA_SIGN_TRANSACTION_SUCCESS,
    MESSAGES.SOLANA_SIGN_TRANSACTION_ERROR,
    MESSAGES.SOLANA_SIGN_MESSAGE_SUCCESS,
    MESSAGES.SOLANA_SIGN_MESSAGE_ERROR,
    MESSAGES.SOLANA_SIGN_AND_SEND_TRANSACTION_SUCCESS,
    MESSAGES.SOLANA_SIGN_AND_SEND_TRANSACTION_ERROR,
    MESSAGES.SOLANA_CHECK_CONNECTION_SUCCESS,
    MESSAGES.SOLANA_CHECK_CONNECTION_ERROR,
    MESSAGES.K2_CONNECT_SUCCESS,
    MESSAGES.K2_CONNECT_ERROR,
    MESSAGES.K2_DISCONNECT_SUCCESS,
    MESSAGES.K2_DISCONNECT_ERROR
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

  chrome.runtime.onMessage.addListener(function(request) {
    const accountsChangedEvent = new CustomEvent('accountsChanged')
    const chainChangedEvent = new CustomEvent('chainChanged')
    const networkChangedEvent = new CustomEvent('networkChanged')

    switch(request?.type) {
      case MESSAGES.ACCOUNTS_CHANGED:
        window.dispatchEvent(accountsChangedEvent)
        break
      case MESSAGES.CHAIN_CHANGED:
        window.dispatchEvent(chainChangedEvent)
        break
      case MESSAGES.NETWORK_CHANGED:
        window.dispatchEvent(networkChangedEvent)
        break
    }
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
      case MESSAGES.KOI_CREATE_DID:
      case MESSAGES.KOI_UPDATE_DID:
      case MESSAGES.SIGNATURE:
      case MESSAGES.TEST_ETHEREUM:
      case MESSAGES.ETHEREUM_RPC_REQUEST:
      case MESSAGES.SOLANA_CONNECT:
      case MESSAGES.SOLANA_CHECK_CONNECTION:
      case MESSAGES.SOLANA_DISCONNECT:
      case MESSAGES.SOLANA_SIGN_ALL_TRANSACTIONS:
      case MESSAGES.SOLANA_SIGN_TRANSACTION:
      case MESSAGES.SOLANA_SIGN_MESSAGE:
      case MESSAGES.SOLANA_SIGN_AND_SEND_TRANSACTION:
      case MESSAGES.K2_CONNECT:
      case MESSAGES.K2_DISCONNECT:
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
