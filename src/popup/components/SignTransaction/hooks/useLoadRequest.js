import { useState, useEffect } from 'react'
import { get } from 'lodash'

import storage from 'services/storage'
import validateToken from 'utils/erc20/validateToken'

import helper from './helper'
import { popupAccount } from 'services/account'

const useLoadRequest = ({ setIsLoading }) => {
  const [requestPayload, setRequestPayload] = useState(null)
  const [network, setNetwork] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [favicon, setFavicon] = useState(null)
  const [dataString, setDataString] = useState(null)
  const [transactionType, setTransactionType] = useState(null)
  const [senderName, setSenderName] = useState(null)
  const [recipientName, setRecipientName] = useState(null)
  
  useEffect(() => {
    const loadRequest = async () => {
      try {
        setIsLoading(true)
        const request = await storage.generic.get.pendingRequest()
    
        const requestPayload = get(request, 'data.requestPayload')
        const network = get(request, 'data.network')
        const origin = get(request, 'data.origin')
        const requestId = get(request, 'data.requestId')
        const favicon = get(request, 'data.favicon')
        const recipientName = get(request, 'data.recipientName')
  
        const data = get(requestPayload, 'data')
  
        let transactionType
        if (network === 'ETHEREUM') {
          transactionType = await helper.getEthereumTransactionType(requestPayload)
        }
        if (network === 'ARWEAVE') {
          transactionType = await helper.getArweaveTransactionType(requestPayload)
        }

        const sender = get(requestPayload, 'from')
        const account = await popupAccount.getAccount({ address: sender })
        const senderName = await account.get.accountName()
  
        setRequestPayload(requestPayload)
        setNetwork(network)
        setOrigin(origin)
        setRequestId(requestId)
        setFavicon(favicon)
        setTransactionType(transactionType)
        setDataString(data)
        setSenderName(senderName)
        setRecipientName(recipientName)
      } catch (err) {
        console.error('loadRequest error: ', err.message)
      }
    }

    loadRequest()
  }, [])

  return { 
    transactionPayload: requestPayload, 
    network, 
    origin, 
    requestId, 
    favicon,
    transactionType,
    dataString,
    senderName,
    recipientName
  }
}

export default useLoadRequest
