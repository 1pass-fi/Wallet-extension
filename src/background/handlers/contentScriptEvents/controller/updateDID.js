// Constants
import helpers from 'background/helpers'
import { REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
// Services
import storage from 'services/storage'
// Utils
import { createWindow, getPlatformInfo } from 'utils/extension'

export default async (payload, tab, next) => {
  const { didData, txId, newkID } = payload.data
  const { origin, favicon, hadPermission, hasPendingRequest, activatedAddress } = tab

  if (!hadPermission) {
    next({ data: { status: 400, data: 'Do not have permissions.' } })
    return
  }

  if (hasPendingRequest) {
    next({ data: { status: 400, data: 'Request pending.' } })
    return
  }

  if (!didData) {
    next({ data: { status: 400, data: 'Invalid input' } })
    return
  }

  if (!activatedAddress) {
    next({ data: { status: 400, data: 'Address not found' } })
    return
  }

  const fee = 0.00007

  const transaction = {
    didData,
    txId,
    newkID,
    activatedAddress
  }

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
          qty: 0,
          address: '',
          origin,
          favicon,
          fee,
          isKoi: true,
          isUpdateDID: true
        }
      })
    },
    afterClose: async () => {
      chrome.action.setBadgeText({ text: '' })
      next({ data: { status: 403, data: 'Transaction rejected on closed.' } })
      await storage.generic.set.pendingRequest({})
    }
  })
}
