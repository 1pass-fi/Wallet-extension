import { useState, useEffect } from 'react'
import { get } from 'lodash'

import storage from 'services/storage'

const useLoadRequest = () => {
  const [requestPayload, setRequestPayload] = useState(null)
  const [network, setNetwork] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [favicon, setFavicon] = useState(null)
  const [isContractDeployment, setIsContractDeployment] = useState(false)
  const [isMintCollectibles, setIsMintCollectibles] = useState(false)
  
  useEffect(() => {
    storage.generic.get.pendingRequest().then(request => {
      console.log('request data', request)

      const requestPayload = get(request, 'data.requestPayload')
      const network = get(request, 'data.network')
      const origin = get(request, 'data.origin')
      const requestId = get(request, 'data.requestId')
      const favicon = get(request, 'data.favicon')

      setRequestPayload(requestPayload)
      setNetwork(network)
      setOrigin(origin)
      setRequestId(requestId)
      setFavicon(favicon)
    })
  }, [])

  return { 
    transactionPayload: requestPayload, 
    network, 
    origin, 
    requestId, 
    favicon,
    isContractDeployment,
    isMintCollectibles
  }
}

export default useLoadRequest
