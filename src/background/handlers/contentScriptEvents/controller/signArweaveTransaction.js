import helpers from 'background/helpers'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { get } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const { transaction } = payload.data
    const { origin, favicon, hadPermission, hasPendingRequest, activatedAddress } = tab

    if (!hadPermission) {
      next({ error: 'Do not have permissions' })
      return
    }

    if (hasPendingRequest) {
      next({ error: 'Request pending' })
      return
    }

    const tags = get(transaction, 'tags')

    const requestId = uuid()
    const requestPayload = {
      origin,
      favicon,
      requestId,
      network: 'ARWEAVE',
      transactionPayload: {
        from: activatedAddress,
        to: get(transaction, 'target'),
        value: get(transaction, 'quantity'),
        data: get(transaction, 'data'),
        tags
      }
    }

    console.log('requestPayload', requestPayload)

    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight
    const os = window.localStorage.getItem(OS)
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

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.action.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(async function (popupMessage, sender, sendResponse) {
          if (popupMessage.requestId === requestId) {
            const approved = popupMessage.approved
            if (approved) {
              try {
                /* Sign Arweave transaction */
                const credentials = await backgroundAccount.getCredentialByAddress(activatedAddress)
                const account = await backgroundAccount.getAccount(credentials)
                const { data: transactionData } = await storage.generic.get.transactionData()

                transaction.data = transactionData
                const clonedTransaction = await helpers.cloneTransaction(transaction)
                await account.method.signTx(clonedTransaction)

                next({ data: clonedTransaction })
                chrome.runtime.sendMessage({ requestId, finished: true })
              } catch (err) {}
            } else {
            }
          }
        })

        await storage.generic.set.pendingRequest({
          type: REQUEST.AR_TRANSACTION,
          data: requestPayload
        })
      },
      afterClose: async () => {
        chrome.action.setBadgeText({ text: '' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    console.error(err.message)
    next({ error: 'Sign transaction error' })
  }
}
