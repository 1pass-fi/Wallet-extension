import { get } from 'lodash'

import storage from 'services/storage'
import { ERROR_MESSAGE } from 'constants/koiConstants'

const useMethod = ({ setIsLoading, requestId, setError, setShowSigning }) => {
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
        setIsLoading(false)
        setShowSigning(0)
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
    if (requestId) {
      await storage.generic.set.pendingRequest({})
      window.close()
    } else {
      await storage.generic.set.pendingRequest({})
      setShowSigning(0)
    }
  }

  return { onSubmitTransaction, onRejectTransaction }
}

export default useMethod
