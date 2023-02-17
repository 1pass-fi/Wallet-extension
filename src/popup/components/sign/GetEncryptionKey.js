import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
import CloseIcon from 'img/v2/close-icon-white.svg'
import storage from 'services/storage'

const GetEncryptionKey = ({ setError, setIsLoading }) => {
  const [requestData, setRequestData] = useState({})

  useEffect(() => {
    const loadRequest = async () => {
      setIsLoading(true)
      const request = await storage.generic.get.pendingRequest()

      setRequestData(request.data)

      setIsLoading(false)
    }

    loadRequest()
  }, [])

  const onSign = async () => {
    try {
      setIsLoading(true)

      chrome.runtime.onMessage.addListener(async function (message) {
        if (message.requestId === requestData.requestId) {
          setIsLoading(false)
          await storage.generic.remove.pendingRequest()
          chrome.action.setBadgeText({ text: '' })
          window.close()
        }
      })

      const payload = {
        requestId: requestData.requestId,
        approved: true
      }

      chrome.runtime.sendMessage(payload)
    } catch (error) {
      setError(error.message)
    } finally {
      await storage.generic.remove.pendingRequest()
      setIsLoading(false)
    }
  }

  const onClose = async () => {
    const payload = {
      requestId: requestData.requestId,
      approved: false
    }

    chrome.runtime.sendMessage(payload)

    await storage.generic.remove.pendingRequest()

    window.close()
  }

  return (
    <div
      className="absolute z-51 bg-white shadow-md rounded flex flex-col items-center"
      style={{
        width: '381px',
        height: '425px',
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%'
      }}
    >
      <div
        className="bg-blue-800 w-full flex items-center justify-center"
        style={{ height: '67px' }}
      >
        <div className="font-semibold text-xl text-white leading-6 text-center tracking-finnieSpacing-wide">
          {chrome.i18n.getMessage('RequestEncryptionKey')}
        </div>
        <CloseIcon
          style={{ width: '30px', height: '30px' }}
          className="absolute top-4 right-4 cursor-pointer"
          onClick={onClose}
        />
      </div>

      <div
        className="w-full mt-3.5 px-3 text-indigo text-center text-sm tracking-finnieSpacing-wide"
        style={{ marginTop: '135px' }}
      >
        {requestData.origin} {chrome.i18n.getMessage('EncryptionKeyRequest')}
      </div>

      <div className="absolute bottom-3.25 w-full flex justify-between px-4.5">
        <button
          className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
          style={{ width: '160px', height: '38px' }}
          onClick={onClose}
        >
          {chrome.i18n.getMessage('Cancel')}
        </button>
        <button
          onClick={onSign}
          className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white"
          style={{ width: '160px', height: '38px' }}
        >
          {chrome.i18n.getMessage('Provide')}
        </button>
      </div>
    </div>
  )
}

export default connect(null, { setError, setIsLoading })(GetEncryptionKey)
