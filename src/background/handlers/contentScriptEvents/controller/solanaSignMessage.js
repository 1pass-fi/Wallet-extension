import base58 from 'bs58'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { get } from 'lodash'
import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'
import nacl from 'tweetnacl'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const {
      origin,
      favicon,
      url,
      hadPermission,
      hasPendingRequest,
      siteAddressDictionary,
      activatedAddress,
      connectedAddresses
    } = tab

    if (!hadPermission) {
      return next({ error: { code: 4100, data: 'No permissions' } })
    }

    if (hasPendingRequest) {
      return next({ error: { code: 4001, data: 'Request pending' } })
    }

    /* Get message to sign */
    let message = get(payload, 'data')
    const encodedMessage = new TextEncoder().encode(message)

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
    const requestData = {
      origin,
      favicon,
      requestId,
      isSolana: true,
      requestPayload: { message }
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.action.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              try {
                const credentials = await backgroundAccount.getCredentialByAddress(connectedAddresses[0])
                const solTool = new SolanaTool(credentials)
                const keypair = solTool.keypair
                const signature = nacl.sign.detached(encodedMessage, keypair.secretKey)
                const returnPayload = {
                  publicKey: keypair.publicKey.toString(),
                  signature: base58.encode(signature)
                }
              
                if (nacl.sign.detached.verify(encodedMessage, signature, keypair.publicKey.toBytes()))
                  next({
                    data: returnPayload
                  })
                else next({ error: { code: 4001, data: 'Invalid signature' } })

                chrome.runtime.sendMessage({ requestId, finished: true })
                sendResponse({data: { requestId, finished: true }})
              } catch (err) {
                console.error('Solana sign message error: ', err)
                chrome.runtime.sendMessage({ requestId, finished: true })
                sendResponse({data: { requestId, finished: true }})
                next({ error: { code: 4001, data: 'Solana sign message error' } })
              }
            } else {
              next({ error: { code: 4001, data: 'User rejected request' } })
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.SOLANA_SIGN_MESSAGE,
          data: requestData
        })
      },
      afterClose: async () => {
        chrome.action.setBadgeText({ text: '' })
        next({ error: 'User cancelled sign message.' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    console.error(err)
    next({ error: { code: 4001, data: 'Solana signMessage error' } })
  }
}
