import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { setError } from 'actions/error'
import { setIsLoading } from 'actions/loading'
import CloseIcon from 'img/v2/close-icon-white.svg'
import get from 'lodash/get'
import storage from 'services/storage'

function formatJsonString(jsonString) {
  try {
    let indentLevel = 0
    let result = ''
    let inQuotes = false
    let currentChar = ''
  
    for (let i = 0; i < jsonString.length; i++) {
      currentChar = jsonString.charAt(i)
  
      switch (currentChar) {
        case '{':
        case '[':
          result += currentChar + '\n' + '\t'.repeat(++indentLevel)
          break
        case '}':
        case ']':
          result += '\n' + '\t'.repeat(--indentLevel) + currentChar
          break
        case ',':
          result += currentChar + (inQuotes ? '' : '\n' + '\t'.repeat(indentLevel))
          break
        case ':':
          result += currentChar + (inQuotes ? ' ' : '')
          break
        case ' ':
        case '\n':
        case '\t':
          if (inQuotes) {
            result += currentChar
          }
          break
        case '"':
          result += currentChar
          inQuotes = !inQuotes
          break
        default:
          result += currentChar
      }
    }
    return result.replace(/\t/g, '  ')
  } catch (err) {
    console.error(err)
    return jsonString
  }
}

const SolanaSignMessage = ({ setError, setIsLoading }) => {
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
      setIsLoading(false)
    } finally {
      await storage.generic.remove.pendingRequest()
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
        width: '426px',
        height: '600px',
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
          {chrome.i18n.getMessage('signingMessage')}
        </div>
      </div>

      <div className="w-full mt-4.5 px-3 text-indigo text-center">
        <div className="font-light text-sm tracking-finnieSpacing-wide ">{requestData.origin}</div>
      </div>

      <div className="w-full mt-3.5 px-3 text-indigo">
        <div className="font-semibold text-base text-left">{chrome.i18n.getMessage('message')}</div>
        <div
          className="font-light text-sm text-left tracking-finnieSpacing-wide overflow-auto"
          style={{ maxHeight: '280px' }}
        >
          <pre className='overflow-y-scroll'>{formatJsonString(get(requestData, 'requestPayload.message'))}</pre>
        </div>
      </div>

      <div className="absolute bottom-3.25 w-full flex justify-between px-4.5">
        <button
          className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800 mb-8"
          style={{ width: '160px', height: '38px' }}
          onClick={onClose}
        >
          {chrome.i18n.getMessage('reject')}
        </button>
        <button
          onClick={onSign}
          className="bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white mb-8"
          style={{ width: '160px', height: '38px' }}
        >
          {chrome.i18n.getMessage('sign')}
        </button>
      </div>
    </div>
  )
}

export default connect(null, { setError, setIsLoading })(SolanaSignMessage)
