import { getSdkError } from '@walletconnect/utils'
import base58 from 'bs58'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { get } from 'lodash'
import { backgroundAccount } from 'services/account'
import { SolanaTool } from 'services/solana'
import storage from 'services/storage'
import nacl from 'tweetnacl'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, next) => {
  try {
    console.log('solana sign message', payload)

    const params = get(payload, 'params')
    const encodedMessage = get(params, 'message')
    const message = new TextDecoder().decode(base58.decode(encodedMessage))

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
                const credentials = await backgroundAccount.getCredentialByAddress(
                  get(params, 'pubkey')
                )
                const solTool = new SolanaTool(credentials)
                const keypair = solTool.keypair

                const signature = nacl.sign.detached(
                  base58.decode(encodedMessage),
                  keypair.secretKey
                )
                console.log('signature', signature)

                if (
                  nacl.sign.detached.verify(
                    base58.decode(encodedMessage),
                    signature,
                    keypair.publicKey.toBytes()
                  )
                )
                  next({ data: { signature: base58.encode(signature) } })
                else next({ error: { code: 4001, message: 'Invalid signature' } })

                chrome.runtime.sendMessage({ requestId, finished: true })
                sendResponse({data: { requestId, finished: true }})
              } catch (err) {
                console.error('Solana sign message error: ', err)
                chrome.runtime.sendMessage({ requestId, finished: true })
                sendResponse({data: { requestId, finished: true }})
                next({ error: { code: 4001, message: err.message } })
              }
            } else {
              next({ error: getSdkError('USER_REJECTED_METHODS') })
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
        next({ error: getSdkError('USER_REJECTED_METHODS') })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (error) {
    console.error(err)
    next({ error: { code: 4001, message: error.message } })
  }
}
