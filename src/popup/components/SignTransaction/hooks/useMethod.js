import { isEmpty, get } from 'lodash'

import storage from 'services/storage'
import { ERROR_MESSAGE } from 'constants/koiConstants'

import { popupBackgroundRequest as request } from 'services/request/popup'

import { fromWeiToEth, fromWinstonToAr } from 'utils'
import { TRANSACTION_TYPE } from './constants'

const useMethod = ({ 
  setIsLoading, 
  requestId, 
  setError, 
  setShowSigning, 
  transactionPayload, 
  network, 
  transactionType,
  contractAddress,
  value,
  customTokenRecipient
}) => {
  const handleSendEth = async () => {
    let qty = get(transactionPayload, 'value')
    qty = fromWeiToEth(parseInt(qty, 16))
    const target = get(transactionPayload, 'to')
    const source = get(transactionPayload, 'from')

    return await request.wallet.makeTransfer({
      qty,
      target,
      address: source,
      token: 'ETH'
    })
  }

  const handleSendAr = async () => {
    let qty = get(transactionPayload, 'value')
    qty = fromWinstonToAr(parseInt(qty))
    const target = get(transactionPayload, 'to')
    const source = get(transactionPayload, 'from')

    return await request.wallet.makeTransfer({
      qty,
      target,
      address: source,
      token: 'AR'
    })
  }

  const handleSendCustomTokenEth = async () => {
    await request.wallet.sendCustomTokenEth({
      sender: transactionPayload.from,
      customTokenRecipient,
      contractAddress,
      value
    })
  }

  const handleSendCustomTokenAr = async () => {

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
        let result
        switch (network) {
          case 'ARWEAVE':
            if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
              result = await handleSendCustomTokenAr()
            } else {
              result = await handleSendAr()
            }
            break
          case 'ETHEREUM':
            if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
              result = await handleSendCustomTokenEth()
            } else {
              result = await handleSendEth()
            }
            break
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
