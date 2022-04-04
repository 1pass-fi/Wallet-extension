import { isEmpty, get } from 'lodash'

import storage from 'services/storage'
import { ERROR_MESSAGE } from 'constants/koiConstants'

import { popupBackgroundRequest as request } from 'services/request/popup'

const useMethod = ({ setIsLoading, requestId, setError, setShowSigning, transactionPayload, network }) => {
  const handleSendEth = async (transactionPayload) => {
    let qty = get(transactionPayload, 'value')
    qty = parseInt(qty, 16) / 1000000000000000000
    const target = get(transactionPayload, 'to')
    const source = get(transactionPayload, 'from')

    return await request.wallet.makeTransfer({
      qty,
      target,
      address: source,
      token: 'ETH'
    })
  }

  const handleSendAr = async (transactionPayload) => {
    let qty = get(transactionPayload, 'value')
    qty = parseInt(qty / 1000000000000)
    const target = get(transactionPayload, 'to')
    const source = get(transactionPayload, 'from')

    return await request.wallet.makeTransfer({
      qty,
      target,
      address: source,
      token: 'AR'
    })
  }

  const onSubmitTransaction = async () => {
    try {
      const pendingRequest = await storage.generic.get.pendingRequest()
      if (isEmpty(pendingRequest)) throw new Error(ERROR_MESSAGE.REQUEST_NOT_EXIST)
  
      /* 
        If requestId === undefined, request was sent internally from Finnie
      */
      setIsLoading(true)
      if (requestId) {
        chrome.runtime.sendMessage({ requestId, approved: true }, function (response) {
          chrome.runtime.onMessage.addListener(function (message) {
            if (message.requestId === requestId) window.close()
          })
        })
        await storage.generic.set.pendingRequest({})
      } else {
        /* 
          Send request to background
        */
        console.log('send message to background')
        switch (network) {
          case 'ARWEAVE':
            console.log(await handleSendAr(transactionPayload))
            break
          case 'ETHEREUM':
            console.log(await handleSendEth(transactionPayload))
        }
        setIsLoading(false)
        setShowSigning(false)
      }
    } catch (err) {
      console.error(err.message)
      if (requestId) {
        // window.close()
      } else {        
        setIsLoading(false)
        setError(err.message)
      }
    }
  }

  const onRejectTransaction = async () => {
    if (requestId) {
      await storage.generic.set.pendingRequest({})
      window.close()
    } else {
      await storage.generic.set.pendingRequest({})
      setShowSigning(false)
    }
  }

  return { onSubmitTransaction, onRejectTransaction }
}

export default useMethod
