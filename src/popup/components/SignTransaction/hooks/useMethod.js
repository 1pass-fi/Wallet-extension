import { ERROR_MESSAGE } from 'constants/koiConstants'
import { get, isEmpty } from 'lodash'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as request } from 'services/request/popup'
import storage from 'services/storage'
import { fromLampToSol, fromWeiToEth, fromWinstonToAr } from 'utils'

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
  customTokenRecipient,
  rawValue,
  setTxId,
  setShowReceipt,
  getFeeInterval,
  totalFee,
  balance
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

  const handleSendSol = async () => {
    let qty = get(transactionPayload, 'value')
    qty = fromLampToSol(parseInt(qty))
    const target = get(transactionPayload, 'to')
    const source = get(transactionPayload, 'from')

    return await request.wallet.makeTransfer({
      qty,
      target,
      address: source,
      token: 'SOL'
    })
  }

  const handleSendK2 = async () => {
    let qty = get(transactionPayload, 'value')
    qty = fromLampToSol(parseInt(qty))
    const target = get(transactionPayload, 'to')
    const source = get(transactionPayload, 'from')

    return await request.wallet.makeTransfer({
      qty,
      target,
      address: source,
      token: 'KOII'
    })
  }

  const handleSendCustomTokenEth = async () => {
    return await request.wallet.sendCustomTokenEth({
      sender: transactionPayload.from,
      customTokenRecipient,
      contractAddress,
      rawValue
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

  const handleSendCustomTokenSol = async () => {
    return await request.wallet.sendCustomTokenSol({
      sender: transactionPayload.from,
      customTokenRecipient,
      contractAddress,
      rawValue
    })
  }

  const handleSendCustomTokenK2 = async () => {
    return await request.wallet.sendCustomTokenK2({
      sender: transactionPayload.from,
      customTokenRecipient,
      contractAddress,
      rawValue
    })
  }

  const onSubmitTransaction = async () => {
    // if (!totalFee) {
    //   setError('Transaction fee has not been loaded')
    //   return
    // }

    try {
      let totalOriginExpense
      if (transactionType === TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER) {
        totalOriginExpense = value + totalFee
      } else {
        totalOriginExpense = totalFee
      }

      const senderAddress = get(transactionPayload, 'from')

      const account = await popupAccount.getAccount({ address: senderAddress })
      const accountBalance = (await account.get.balance()) / Math.pow(10, 9)

      if (accountBalance < totalOriginExpense) {
        setError('Not enough tokens')
        return
      }

      if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
        if (balance < value) {
          setError('Not enough tokens')
          return
        }
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
      clearInterval(getFeeInterval)
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
          case 'SOLANA':
            if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
              result = await handleSendCustomTokenSol()
            } else {
              result = await handleSendSol()
            }
            break
          case 'K2':
            if (transactionType === TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER) {
              result = await handleSendCustomTokenK2()
            } else {
              result = await handleSendK2()
            }
            break
        }

        setIsLoading(false)
        setShowReceipt(true)
        setTxId(result)
        storage.generic.set.pendingRequest({})
        // setShowSigning(false)
      }
    } catch (err) {
      console.error(err.message)
      if (requestId) {
        // window.close()
        setError(err.message)
      } else {
        setIsLoading(false)
        setError(err.message)
      }
    }
  }

  const onRejectTransaction = async () => {
    clearInterval(getFeeInterval)
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
