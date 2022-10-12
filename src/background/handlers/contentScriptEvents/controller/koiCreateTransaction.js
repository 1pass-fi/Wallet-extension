// Constants
import { REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
// Services
import arweave from 'services/arweave'
import storage from 'services/storage'
import { winstonToAr } from 'utils'
// Utils
import { createWindow, getPlatformInfo } from 'utils/extension'

export default async (payload, tab, next) => {
  try {
    const { transaction } = payload.data
    const { origin, favicon, hadPermission, hasPendingRequest } = tab

    if (!hadPermission) {
      next({ data: { status: 400, data: 'Do not have permissions.' } })
      return
    }

    if (hasPendingRequest) {
      next({ data: { status: 400, data: 'Request pending.' } })
      return
    }

    const [isKoiTransfer, koiiQty] = getKoiiQty(transaction)

    const qty = winstonToAr(transaction.quantity)
    const address = transaction.target
    const fee = (await arweave.transactions.getPrice(transaction.data_size)) / 1000000000000

    const screen = (await chrome.system.display.getInfo())[0].bounds
    const screenWidth = screen.width
    const screenHeight = screen.height

    const isWin = (await getPlatformInfo()) === 'win'
    const width = isWin ? WINDOW_SIZE.WIN_WIDTH : WINDOW_SIZE.MAC_WIDTH
    const height = isWin ? WINDOW_SIZE.WIN_HEIGHT : WINDOW_SIZE.MAC_HEIGHT

    const windowData = {
      url: chrome.runtime.getURL('/popup.html'),
      focused: true,
      type: 'popup',
      height,
      width,
      left: Math.round((screenWidth - width) / 2),
      top: Math.round((screenHeight - height) / 2)
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.action.setBadgeText({ text: '1' })
        await storage.generic.set.pendingRequest({
          type: REQUEST.AR_TRANSACTION,
          data: {
            transaction,
            qty,
            address,
            origin,
            favicon,
            fee,
            isKoi: true,
            isKoiTransfer,
            koiiQty
          }
        })
      },
      afterClose: async () => {
        chrome.action.setBadgeText({ text: '' })
        next({ data: { status: 403, data: 'Transaction rejected on closed.' } })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    console.error(err.message)
    next({ data: { status: 500, data: 'Sign transaction error' } })
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
