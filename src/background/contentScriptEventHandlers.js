import { isInteger, isString } from 'lodash'

import { REQUEST, MESSAGES } from 'koiConstants'
import { checkSitePermission, setChromeStorage, transfer } from 'utils'
import { getSelectedTab, createWindow } from 'utils/extension'

let pendingMessages = {}

export default async (koi, port, message, ports, resolveId) => {
  if (!message.type) return

  if (pendingMessages[message.type] === true) return
  pendingMessages[message.type] = true

  const getCurrentTab = () => {
    return new Promise((resolve, reject) => {
      getSelectedTab().then(tab => {
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
      const allowedEndpoints = [
        MESSAGES.GET_PERMISSION,
        MESSAGES.CREATE_TRANSACTION,
        MESSAGES.CONNECT,
        MESSAGES.KOI_GET_PERMISSION,
        MESSAGES.KOI_CONNECT,
      ]
      if (!allowedEndpoints.includes(message.type)) {
        if (!hadPermission) {
          port.postMessage({
            type: `${message.type}_SUCCESS`,
            data: { status: 401, data: 'Do not have permissions.' },
            id: message.id
          })
          return
        }
      }

      switch (message.type) {
        case MESSAGES.GET_ADDRESS: {
          if (koi.address) {
            port.postMessage({
              type: MESSAGES.GET_ADDRESS_SUCCESS,
              data: koi.address,
              id: message.id
            })
          } else {
            port.postMessage({
              type: MESSAGES.GET_ADDRESS_ERROR,
              data: 'Address not found',
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_GET_ADDRESS: {
          if (koi.address) {
            port.postMessage({
              type: MESSAGES.KOI_GET_ADDRESS_SUCCESS,
              data: { status: 200, data: koi.address },
              id: message.id
            })
          } else {
            port.postMessage({
              type: MESSAGES.KOI_GET_ADDRESS_SUCCESS,
              data: { status: 404, data: 'Address not found.' },
              id: message.id
            })
          }
          break
        }

        case MESSAGES.GET_PERMISSION: {
          if (hadPermission) {
            port.postMessage({
              type: MESSAGES.GET_PERMISSION_SUCCESS,
              data: ['SIGN_TRANSACTION', 'GET_ADDRESS'],
              id: message.id
            })
          } else {
            port.postMessage({
              type: MESSAGES.GET_PERMISSION_SUCCESS,
              data: [],
              id: message.id
            })
          }
          break
        }

        case MESSAGES.KOI_GET_PERMISSION: {
          if (hadPermission) {
            port.postMessage({
              type: MESSAGES.KOI_GET_PERMISSION_SUCCESS,
              data: { status: 200, data: ['SIGN_TRANSACTION', 'GET_ADDRESS'] },
              id: message.id
            })
          } else {
            port.postMessage({
              type: MESSAGES.KOI_GET_PERMISSION_SUCCESS,
              data: { status: 200, data: [] },
              id: message.id
            })
          }
          break
        }

        case MESSAGES.CONNECT: {
          const { id } = message
          const { permissionId } = resolveId
          
          if (!hadPermission) {
            permissionId.push(id)
            await setChromeStorage({
              'pendingRequest': {
                type: REQUEST.PERMISSION,
                data: { origin, favicon }
              }
            })
            createWindow({
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
              height: 622,
              width: 426
            })
          } else {
            port.postMessage({
              type: MESSAGES.CONNECT_ERROR,
              data: { message: 'This site has already connected.' },
              id
            })
          }
          break
        }

        case MESSAGES.KOI_CONNECT: {
          const { id } = message
          const { permissionId } = resolveId
          
          if (!hadPermission) {
            permissionId.push(id)
            await setChromeStorage({
              'pendingRequest': {
                type: REQUEST.PERMISSION,
                data: { origin, favicon }
              }
            })
            createWindow({
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
              height: 622,
              width: 426
            })
          } else {
            port.postMessage({
              type: MESSAGES.KOI_CONNECT_SUCCESS,
              data: { status: 400, data: 'This site has already connected.' },
              id
            })
          }
          break
        }

        case MESSAGES.CREATE_TRANSACTION: {
          const { transaction } = message.data
          console.log('ORIGIN', origin)
          console.log('FAVICON', favicon)
          console.log('TRANSACTION', transaction)
          console.log('PERMISSION CREATE TRANSACTION', hadPermission)

          const { id } = message
          const { createTransactionId } = resolveId
          createTransactionId.push(id)
          if (!hadPermission) {
            port.postMessage({
              type: MESSAGES.CREATE_TRANSACTION_ERROR,
              data: { message: 'Do not have permission.' },
              id: message.id
            })
          } else {
            const qty = transaction.quantity
            const address = transaction.target
            console.log('QUANTITY', qty)
            console.log('ADDRESS', address)
            await setChromeStorage({
              'pendingRequest': {
                type: REQUEST.TRANSACTION,
                data: { transaction, qty, address, origin, favicon }
              }
            })
            createWindow({
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
              height: 622,
              width: 426
            })
          }
          break
        }

        case MESSAGES.KOI_CREATE_TRANSACTION: {
          const { transaction } = message.data
          console.log('ORIGIN', origin)
          console.log('FAVICON', favicon)
          console.log('TRANSACTION', transaction)
          console.log('PERMISSION CREATE TRANSACTION', hadPermission)

          const { id } = message
          const { createTransactionId } = resolveId
          createTransactionId.push(id)

          const qty = transaction.quantity
          const address = transaction.target
          console.log('QUANTITY', qty)
          console.log('ADDRESS', address)
          await setChromeStorage({
            'pendingRequest': {
              type: REQUEST.TRANSACTION,
              data: { transaction, qty, address, origin, favicon }
            }
          })
          createWindow({
            url: chrome.extension.getURL('/popup.html'),
            focused: true,
            type: 'popup',
            height: 622,
            width: 426
          })
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
