import { REQUEST, MESSAGES } from 'koiConstants'
import { checkSitePermission, setChromeStorage, transfer } from 'utils'
import { isInteger, isString } from 'lodash'

let pendingMessages = {}

export default async (koi, port, message) => {
  if (!message.type) return

  if (pendingMessages[message.type] === true) return
  pendingMessages[message.type] = true

  const getCurrentTab = () => {
    return new Promise((resolve, reject) => {
      chrome.tabs.getSelected(null, tab => {
        try {
          const url = tab.url
          const origin = (new URL(url)).origin
          const favicon = tab.favIconUrl
          resolve({ origin, favicon, url })
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  const checkCurrentTabPermission = async () => {
    const tab = await getCurrentTab()
    const hadPermission = await checkSitePermission(tab.origin)
    return { ...tab, hadPermission }
  }

  const perform = async () => {
    try {
      const { origin, favicon, hadPermission } = await checkCurrentTabPermission()
      if (![MESSAGES.GET_PERMISSION, MESSAGES.CREATE_TRANSACTION].includes(message.type)) {
        if (!hadPermission) {
          port.postMessage({
            type: `${message.type}_ERROR`,
            data: 'You don\'t have enough permissions to perform this action'
          })
          return
        }
      }

      switch (message.type) {
        case MESSAGES.GET_ADDRESS: {
          if (koi.address) {
            port.postMessage({
              type: MESSAGES.GET_ADDRESS_SUCCESS,
              data: koi.address
            })
          } else {
            port.postMessage({
              type: MESSAGES.GET_ADDRESS_ERROR,
              data: 'Address not found'
            })
          }
          break
        }
        case MESSAGES.GET_PERMISSION: {
          if (!hadPermission) {
            await setChromeStorage({
              'pendingRequest': {
                type: REQUEST.PERMISSION,
                data: { origin, favicon }
              }
            })
            chrome.windows.create({
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
              height: 622,
              width: 426
            })
          }
          break
        }
        case MESSAGES.CREATE_TRANSACTION: {
          console.log('CREATE TRANSACTION BACKGROUND')
          const { qty, address } = message.data
          console.log('ORIGIN', origin)
          console.log('FAVICON', favicon)
          console.log('QTY', qty)
          console.log('ADDRESS', address)

          if (!isInteger(qty) || qty < 0) {
            port.postMessage({
              type: MESSAGES.CREATE_TRANSACTION_ERROR,
              data: 'Invalid input qty.'
            })
            break
          }

          if (!isString(address)) {
            port.postMessage({
              type: MESSAGES.CREATE_TRANSACTION_ERROR,
              data: 'Invalid input address.'
            })
            break
          }

          if (!hadPermission) {
            await setChromeStorage({
              'pendingRequest': {
                type: REQUEST.PERMISSION,
                data: { origin, favicon }
              }
            })
            chrome.windows.create({
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
              height: 622,
              width: 426
            })
            port.postMessage({
              type: MESSAGES.CREATE_TRANSACTION_ERROR,
              data: 'Do not have permission.'
            })
          } else {
            await setChromeStorage({
              'pendingRequest': {
                type: REQUEST.TRANSACTION,
                data: { origin, favicon, qty, address }
              }
            })
            chrome.windows.create({
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
              height: 622,
              width: 426
            })
          }
          break
        }
        default:
          break
      }
    } catch (err) {
      port.postMessage({
        type: MESSAGES.ERROR,
        data: err.message
      })
    }
  }

  await perform()

  pendingMessages[message.type] = undefined
}
