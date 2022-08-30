import { useState, useEffect } from 'react'
import { get, isEmpty } from 'lodash'

import storage from 'services/storage'
import validateToken from 'utils/erc20/validateToken'

import helper from './helper'
import { popupAccount } from 'services/account'

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

        let data = get(transactionPayload, 'data')
        if (network === 'ARWEAVE') {
          data = (await storage.generic.get.transactionData()?.data) || '{}'
          data = Object.values(JSON.parse(data)) || []
        }

        let transactionType
        if (network === 'ETHEREUM') {
          transactionType = await helper.getEthereumTransactionType(transactionPayload)
        }
        if (network === 'ARWEAVE') {
          transactionType = await helper.getArweaveTransactionType(transactionPayload)
        }
        if (network === 'SOLANA') {
          transactionType = await helper.getSolanaTransactionType(transactionPayload)
        }
        if (network === 'K2') {
          transactionType = await helper.getK2TransactionType(transactionPayload)
        }

        const sender = get(transactionPayload, 'from')
        const account = await popupAccount.getAccount({ address: sender })
        const senderName = await account.get.accountName()

        setTransactionPayload(transactionPayload)
        setNetwork(network)
        setOrigin(origin)
        setRequestId(requestId)
        setFavicon(favicon)
        setTransactionType(transactionType)
        if (network === 'ARWEAVE') {
          setDataString(data.toString())
        } else {
          console.log('useLoadRequests', data)
          setDataString(data)
        }
        setSenderName(senderName)
        setRecipientName(recipientName)
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
    recipientName
  }
}

export default useLoadRequest
