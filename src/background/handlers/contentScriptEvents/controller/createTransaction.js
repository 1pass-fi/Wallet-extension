// Constants
import { REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { isNumber } from 'lodash'
// Services
import storage from 'services/storage'
import { calculateArFee,winstonToAr } from 'utils'
// Utils
import { createWindow, getPlatformInfo } from 'utils/extension'
import { v4 as uuid } from 'uuid'


export default async (payload, tab, next) => {
  try {
    const { transaction } = payload.data
    const { origin, favicon, hadPermission, hasPendingRequest } = tab

    const address = transaction.target
    const qty = winstonToAr(transaction.quantity)
    const fee = await calculateArFee(transaction.data_size)

    if (!hadPermission) {
      next({ error: 'Do not have permissions.' })
      return
    }

    if (hasPendingRequest) {
      next({ error: 'Request pending.' })
      return
    }

    // handle get input
    const [isKoiTransfer, koiiQty] = getKoiiQty(transaction)

    const screenWidth = screen.availWidth
    const screenHeight = screen.availHeight

    const isWin = (await getPlatformInfo()) === 'win'
    const width = isWin ? WINDOW_SIZE.WIN_WIDTH : WINDOW_SIZE.MAC_WIDTH
    const height = isWin ? WINDOW_SIZE.WIN_HEIGHT : WINDOW_SIZE.MAC_HEIGHT

    const windowData = {
      url: chrome.extension.getURL('/popup.html'),
      focused: true,
      type: 'popup',
      height,
      width,
      left: Math.round((screenWidth - width) / 2),
      top: Math.round((screenHeight - height) / 2)
    }

    const requestId = uuid()

    const transactionPayload = {
      transaction,
      qty,
      address,
      origin,
      favicon,
      fee,
      isKoi: false,
      isKoiiTransfer,
      koiiQty
    }

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
  } catch (err) {
    console.error(err.message)
    next({ error: 'Sign transaction error' })
  }
}

const getKoiiQty = (transaction) => {
  let isKoiTransfer = false
  let koiiQty = 0

  try {
    const valueString = Buffer.from(transaction.tags[3].value, 'base64')
    const inputValue = JSON.parse(valueString)
    const functionName = inputValue.function
    
    if (functionName === 'transfer' && isNumber(koiiQty)) isKoiTransfer = true
    koiiQty = inputValue.qty
  } catch (err) {
    console.log('Get koii qty error: ', err.message)
  }
  
  return [isKoiTransfer, koiiQty]
}
