import { concatSig } from '@metamask/eth-sig-util'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { ecsign, stripHexPrefix } from 'ethereumjs-util'
import { ethers } from 'ethers'
import { get } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const { favicon, origin, hadPermission, connectedAddresses } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    const params = get(payload, 'data.params')
    const message = stripHexPrefix(params[1])

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
      origin,
      favicon,
      requestId,
      isEthereum: true,
      requestPayload: {
        message: params[1]
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
                const credential = await backgroundAccount.getCredentialByAddress(
                  ethers.utils.getAddress(connectedAddresses[0])
                )
                const key = credential.key.split('x')[1]

                const msgSig = ecsign(Buffer.from(message, 'hex'), Buffer.from(key, 'hex'))

                const rawMsgSig = concatSig(msgSig.v, msgSig.r, msgSig.s)

                next({ data: rawMsgSig })

                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {
                console.error('ETH sign error:', err.message)
                chrome.runtime.sendMessage({ requestId, finished: true })
                next({ error: { code: 4001, data: err.message } })
              }
            } else {
              next({ error: { code: 4001, data: 'User rejected request' } })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.ETH_SIGN,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.browserAction.setBadgeText({ text: '' })
        next({ error: 'User cancelled the login.' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
