import { concatSig } from '@metamask/eth-sig-util'
import { getSdkError } from '@walletconnect/utils'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { ecsign, stripHexPrefix } from 'ethereumjs-util'
import { ethers } from 'ethers'
import { get, isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export function convertHexToUtf8(value) {
  if (ethers.utils.isHexString(value)) {
    return ethers.utils.toUtf8String(value)
  }
  return value
}

export default async (payload, next) => {
  try {
    const params = get(payload, 'params')
    const message = params[1]

    /* Show popup */
    const screen = (await chrome.system.display.getInfo())[0].bounds
    const screenWidth = screen.width
    const screenHeight = screen.height
    const os = (await chrome.runtime.getPlatformInfo()).os
    let windowData = {
      url: chrome.runtime.getURL('/popup.html'),
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
        chrome.action.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              try {
                const credential = await backgroundAccount.getCredentialByAddress(
                  ethers.utils.getAddress(params[0])
                )

                const msgSig = ecsign(
                  Buffer.from(stripHexPrefix(message), 'hex'),
                  Buffer.from(stripHexPrefix(credential.key), 'hex')
                )

                const rawMsgSig = concatSig(msgSig.v, msgSig.r, msgSig.s)

                next({ data: rawMsgSig })

                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('ETH sign error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: getSdkError('USER_REJECTED_METHODS') })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.ETH_SIGN,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.action.setBadgeText({ text: '' })
        next({ error: getSdkError('USER_REJECTED_METHODS') })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: { code: 4001, message: err.message } })
  }
}