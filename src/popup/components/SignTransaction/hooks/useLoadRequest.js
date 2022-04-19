import { useState, useEffect } from 'react'
import { get } from 'lodash'

import storage from 'services/storage'
import validateToken from 'utils/erc20/validateToken'

import helper from './helper'

const useLoadRequest = ({ setIsLoading }) => {
  const [requestPayload, setRequestPayload] = useState(null)
  const [network, setNetwork] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [favicon, setFavicon] = useState(null)
  const [dataString, setDataString] = useState(null)

  const [transactionType, setTransactionType] = useState(null)
  
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
  
        const data = get(requestPayload, 'data')
  
        let transactionType
        if (network === 'ETHEREUM') {
          transactionType = await helper.getEthereumTransactionType(requestPayload)
        }
        if (network === 'ARWEAVE') {
          transactionType = await helper.getArweaveTransactionType(requestPayload)
        }
  
        setRequestPayload(requestPayload)
        setNetwork(network)
        setOrigin(origin)
        setRequestId(requestId)
        setFavicon(favicon)
        setTransactionType(transactionType)
        setDataString(data)
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
    dataString
  }
}

export default useLoadRequest
