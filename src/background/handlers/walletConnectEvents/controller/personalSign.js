import { getInternalError, getSdkError } from '@walletconnect/utils'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import ethereumUtils from 'utils/ethereumUtils'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

function convertHexToUtf8(value) {
  if (ethers.utils.isHexString(value)) {
    return ethers.utils.toUtf8String(value)
  }
  return value
}

export default async (payload, metadata, next) => {
  try {
    console.log('personal sign')
    console.log('payload', payload)
    console.log('metadata', metadata)

    const params = get(payload, 'params')
    const message = convertHexToUtf8(params[0])

    /* Show popup */
    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight
    const os = window.localStorage.getItem(OS)
    let windowData = {
      url: chrome.extension.getURL('/popup.html'),
      focused: true,
      type: 'popup'
    }
    if (os == 'win') {
      windowData = {
        ...windowData,
        height: WINDOW_SIZE.WIN_HEIGHT,
        width: WINDOW_SIZE.WIN_WIDTH,
        left: Math.round((screenWidth - WINDOW_SIZE.WIN_WIDTH) / 2),
        top: Math.round((screenHeight - WINDOW_SIZE.WIN_HEIGHT) / 2)
      }
    } else {
      windowData = {
        ...windowData,
        height: WINDOW_SIZE.MAC_HEIGHT,
        width: WINDOW_SIZE.MAC_WIDTH,
        left: Math.round((screenWidth - WINDOW_SIZE.MAC_WIDTH) / 2),
        top: Math.round((screenHeight - WINDOW_SIZE.MAC_HEIGHT) / 2)
      }
    }

    const requestId = uuid()
    const requestPayload = {
      requestId,
      isEthereum: true,
      requestPayload: {
        message: message
      }
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              try {
                const credential = await backgroundAccount.getCredentialByAddress(params[1])

                if (isEmpty(credential)) {
                  next({ error: { code: 4004, message: 'Account is not imported' } })
                  return
                }

                const provider = await storage.setting.get.ethereumProvider()
                const { ethersProvider, wallet } = ethereumUtils.initEthersProvider(
                  provider,
                  credential.key
                )

                const signer = wallet.connect(ethersProvider)
                const msgSig = await signer.signMessage(message)

                const verifiedAddress = ethers.utils.verifyMessage(message, msgSig)

                console.log('verifiedAddress', verifiedAddress)

                if (verifiedAddress === credential.address) {
                  next({ data: msgSig })
                } else {
                  next({ error: getInternalError('NO_MATCHING_KEY') })
                }

                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('Personal sign error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: getSdkError('USER_REJECTED_METHODS') })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.PERSONAL_SIGN,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.browserAction.setBadgeText({ text: '' })
        next({ error: getSdkError('USER_REJECTED_METHODS') })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: { code: 4001, message: err.message } })
  }
}
