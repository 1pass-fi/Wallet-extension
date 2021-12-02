import { isNumber } from 'lodash'

// Constants
import { REQUEST, WINDOW_SIZE } from 'constants/koiConstants'

// Utils
import { createWindow } from 'utils/extension'

// Services
import arweave from 'services/arweave'
import storage from 'services/storage'

import { createTransactionId } from 'background'


export default async (payload, tab, next) => {
  try {
    const { origin, favicon, hadPermission } = tab

    const { transaction } = payload.data
    console.log('ORIGIN', origin)
    console.log('TRANSACTION', transaction)

    const { id } = payload

    const qty = transaction.quantity / 1000000000000
    const address = transaction.target
    const fee = await arweave.transactions.getPrice(transaction.data_size) / 1000000000000


    let functionName
    let koiiQty
    let isKoiTransfer = false
    // handle get input
    try {
      const valueString = Buffer.from(transaction.tags[3].value, 'base64')
      const inputValue = JSON.parse(valueString)
      functionName = inputValue.function
      koiiQty = inputValue.qty
    } catch (err) {
      console.log('GET INPUT ERROR')
    }

    if (functionName === 'transfer' && isNumber(koiiQty)) isKoiTransfer = true

    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight

    chrome.runtime.getPlatformInfo((info) => {
      let windowData

      if (info.os == 'win') {
        windowData = {
          url: chrome.extension.getURL('/popup.html'),
          focused: true,
          type: 'popup',
          height: WINDOW_SIZE.WIN_HEIGHT,
          width: WINDOW_SIZE.WIN_WIDTH,
          left: Math.round((screenWidth - WINDOW_SIZE.WIN_WIDTH) / 2),
          top: Math.round((screenHeight - WINDOW_SIZE.WIN_HEIGHT) / 2)
        }
      } else [
        windowData = {
          url: chrome.extension.getURL('/popup.html'),
          focused: true,
          type: 'popup',
          height: WINDOW_SIZE.MAC_HEIGHT,
          width: WINDOW_SIZE.MAC_WIDTH,
          left: Math.round((screenWidth - WINDOW_SIZE.MAC_WIDTH) / 2),
          top: Math.round((screenHeight - WINDOW_SIZE.MAC_HEIGHT) / 2)
        }
      ]
      createWindow (
        windowData,
        {
          beforeCreate: async () => {
            chrome.browserAction.setBadgeText({ text: '1' })
            await storage.generic.set.pendingRequest({
              type: REQUEST.TRANSACTION,
              data: { transaction, qty, address, origin, favicon, fee, isKoi: false, isKoiTransfer, koiiQty }
            })
          },
          afterClose: async () => {
            chrome.browserAction.setBadgeText({ text: '' })
            next({ error: 'Transaction rejected on closed.' })
            await storage.generic.set.pendingRequest({})
          },
        }
      )
    })
    createTransactionId.push(id)
  } catch (err) {
    console.error(err.message)
    next({ error: 'Sign transaction error' })
  }
}
