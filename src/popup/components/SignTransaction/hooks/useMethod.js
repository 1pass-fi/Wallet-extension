import { get } from 'lodash'

import storage from 'services/storage'
import { ERROR_MESSAGE } from 'constants/koiConstants'

const useMethod = ({ setIsLoading, requestId, setError }) => {
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
        setIsLoading(false)
      }
    } catch (err) {
      console.error(err.message)
      if (requestId) {
        window.close()
      } else {        
        setIsLoading(false)
        setError(err.message)
      }
    }
  }

  const onRejectTransaction = async () => {
    console.log('requestId', requestId)
    if (requestId) {
      window.close()
    } else {
      storage.generic.set.pendingRequest({})
    }
  }

  return { onSubmitTransaction, onRejectTransaction }
}

export default useMethod
