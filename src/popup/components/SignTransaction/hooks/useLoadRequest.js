import { useState, useEffect } from 'react'
import { get } from 'lodash'

import storage from 'services/storage'
import validateToken from 'utils/erc20/validateToken'

import helper from './helper'

const useLoadRequest = () => {
  const [requestPayload, setRequestPayload] = useState(null)
  const [network, setNetwork] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [favicon, setFavicon] = useState(null)

  const [transactionType, setTransactionType] = useState(null)
  
  useEffect(() => {
    const loadRequest = async () => {
      const request = await storage.generic.get.pendingRequest()
  
      const requestPayload = get(request, 'data.requestPayload')
      const network = get(request, 'data.network')
      const origin = get(request, 'data.origin')
      const requestId = get(request, 'data.requestId')
      const favicon = get(request, 'data.favicon')

      const value = get(requestPayload, 'value')
      const to = get(requestPayload, 'to')
      const data = get(requestPayload, 'data')

      const transactionType = await helper.getEthereumTransactionType(requestPayload)

      setRequestPayload(requestPayload)
      setNetwork(network)
      setOrigin(origin)
      setRequestId(requestId)
      setFavicon(favicon)
      setTransactionType(transactionType)
    }

    loadRequest()
  }, [])

  return { 
    transactionPayload: requestPayload, 
    network, 
    origin, 
    requestId, 
    favicon,
    transactionType
  }
}

export default useLoadRequest
