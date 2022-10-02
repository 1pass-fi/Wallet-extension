import { useEffect,useState } from 'react'
import { get } from 'lodash'
import { popupAccount } from 'services/account'
import storage from 'services/storage'

import helper from './helper'

const useLoadRequest = ({ setIsLoading }) => {
  const [transactionPayload, setTransactionPayload] = useState(null)
  const [network, setNetwork] = useState(null)
  const [origin, setOrigin] = useState(null)
  const [requestId, setRequestId] = useState(null)
  const [favicon, setFavicon] = useState(null)
  const [dataString, setDataString] = useState(null)
  const [transactionType, setTransactionType] = useState(null)
  const [senderName, setSenderName] = useState(null)
  const [recipientName, setRecipientName] = useState(null)
  const [signWithoutSend, setSignWithoutSend] = useState(null)

  useEffect(() => {
    const loadRequest = async () => {
      try {
        setIsLoading(true)
        const request = await storage.generic.get.pendingRequest()

        const transactionPayload = get(request, 'data.transactionPayload')
        const network = get(request, 'data.network')
        const origin = get(request, 'data.origin')
        const requestId = get(request, 'data.requestId')
        const favicon = get(request, 'data.favicon')
        const recipientName = get(request, 'data.recipientName')
        const signWithoutSend = get(request, 'data.signWithoutSend')

        let data = get(transactionPayload, 'data')
        let transactionType = await helper.getEthereumTransactionType(transactionPayload)

        const sender = get(transactionPayload, 'from')
        const account = await popupAccount.getAccount({ address: sender })
        const senderName = await account.get.accountName()

        setTransactionPayload(transactionPayload)
        setNetwork(network)
        setOrigin(origin)
        setRequestId(requestId)
        setFavicon(favicon)
        setTransactionType(transactionType)
        setDataString(data)
        setSenderName(senderName)
        setRecipientName(recipientName)
        setSignWithoutSend(signWithoutSend)
      } catch (err) {
        console.error('loadRequest error: ', err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadRequest()
  }, [])

  return {
    transactionPayload,
    network,
    origin,
    requestId,
    favicon,
    transactionType,
    dataString,
    senderName,
    recipientName,
    signWithoutSend
  }
}

export default useLoadRequest
