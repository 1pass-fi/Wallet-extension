import { ERROR_MESSAGE } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as request } from 'services/request/popup'
import storage from 'services/storage'
import { fromWinstonToAr } from 'utils'

import { TRANSACTION_TYPE } from './constants'

const useMethod = ({
  setIsLoading,
  requestId,
  setError,
  setShowSigning,
  transactionPayload,
  transactionType,
  contractAddress,
  value,
  customTokenRecipient,
  rawValue,
  setTxId,
  setShowReceipt,
  totalFee
}) => {
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

  const handleSendCustomTokenAr = async () => {
    return await request.wallet.sendCustomTokenAr({
      sender: transactionPayload.from,
      customTokenRecipient,
      contractAddress,
      rawValue
    })
  }

  const onSubmitTransaction = async () => {
    try {
      let totalOriginExpense
      if (transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER) {
        totalOriginExpense = value + totalFee
      } else {
        totalOriginExpense = totalFee
      }

      const senderAddress = get(transactionPayload, 'from')

      const account = await popupAccount.getAccount({ address: senderAddress })
      const balance = await account.get.balance()

      if (balance < totalOriginExpense) {
        setError(chrome.i18n.getMessage('notEnoughTokens'))
        return
      }
    } catch (err) {
      console.error('Balance validate error: ', err.message)
    }

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
            if (message.requestId === requestId) {
              if (message.error) {
                setError(message.error)
              } else {
                window.close()
              }
            }
          })
          storage.generic.set.pendingRequest({})
        })
      } else {
        /* 
          Send request to background
        */
        let result
        if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
          result = await handleSendCustomTokenAr()
        } else {
          result = await handleSendAr()
        }

        setIsLoading(false)
        setShowReceipt(true)
        setTxId(result)
        storage.generic.set.pendingRequest({})
      }
    } catch (err) {
      console.error(err.message)
      if (requestId) {
        setError(err.message)
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
