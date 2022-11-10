import { getEncryptionPublicKey } from '@metamask/eth-sig-util'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { stripHexPrefix } from 'ethereumjs-util'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const { favicon, origin, hadPermission } = tab
    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

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
    const requestData = {
      origin,
      favicon,
      requestId,
      isEthereum: true
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              try {
                const defaultEthereumAddress = await storage.setting.get.activatedEthereumAccountAddress()
                const credential = await backgroundAccount.getCredentialByAddress(
                  defaultEthereumAddress
                )

                const privateKey = stripHexPrefix(credential.key)

                const publicKey = getEncryptionPublicKey(privateKey)

                next({ data: publicKey })

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
          type: REQUEST.GET_ENCRYPTION_KEY,
          data: requestData
        })
      },
      afterClose: async () => {
        chrome.browserAction.setBadgeText({ text: '' })
        next({ error: 'User rejected request' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
