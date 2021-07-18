import { REQUEST, MESSAGES, STORAGE, OS, WINDOW_SIZE } from 'koiConstants'
import { setChromeStorage, removeChromeStorage, getChromeStorage } from 'utils'
import { getSelectedTab, createWindow } from 'utils/extension'

import storage from 'storage'

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
    const hadPermission = await storage.generic.method.checkSitePermission(tab.origin)
    return { ...tab, hadPermission }
  }

  const checkPendingRequest = async () => {
    const pendingRequest = await storage.generic.get.pendingRequest()
    if (pendingRequest) return true
    return false
  }

  const perform = async () => {
    try {
      const { origin, favicon, hadPermission } = await checkCurrentTabPermission()
      const hasPendingRequest = await checkPendingRequest()
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
              data: { status: 401, data: [] },
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

            const onClosedMessage = {
              type: MESSAGES.KOI_CONNECT_SUCCESS,
              data: { status: 401, data: 'Connection rejected on closed.' },
              id
            }
            if (hasPendingRequest) {
              port.postMessage({
                type: MESSAGES.KOI_CONNECT_SUCCESS,
                data: { status: 400, data: `Request pending` },
                id
              })
              return
            }

            const screenWidth = screen.availWidth
            const screenHeight = screen.availHeight
            const os = window.localStorage.getItem(OS)
            let windowData = {
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
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

            createWindow(
              windowData,
              {
                beforeCreate: async () => {
                  chrome.browserAction.setBadgeText({ text: '1' })
                  await storage.generic.set.pendingRequest({
                    type: REQUEST.PERMISSION,
                    data: { origin, favicon }
                  })
                },
                afterClose: async () => {
                  chrome.browserAction.setBadgeText({ text: '' })
                  port.postMessage(onClosedMessage)
                  await storage.generic.remove.pendingRequest()
                },
              }
            )

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
            
            const os = window.localStorage.getItem(OS)
            let windowData = {
              url: chrome.extension.getURL('/popup.html'),
              focused: true,
              type: 'popup',
            }
            const screenWidth = screen.availWidth
            const screenHeight = screen.availHeight
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

            createWindow(
              windowData,
              {
                beforeCreate: async () => {
                  chrome.browserAction.setBadgeText({ text: '1' })
                  transaction.data = JSON.parse(transaction.data)
                  console.log({ transaction })
                  await setChromeStorage({
                    'pendingRequest': {
                      type: REQUEST.TRANSACTION,
                      data: { transaction, qty, address, origin, favicon }
                    }
                  })
                },
                afterClose: async () => {
                  chrome.browserAction.setBadgeText({ text: '' })
                  port.postMessage(onClosedMessage)
                  await removeChromeStorage('pendingRequest')
                },
              }
            )
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
          const fee = transaction.fee / 1000000000000
          console.log('QUANTITY', qty)
          console.log('ADDRESS', address)

          const onClosedMessage = {
            type: MESSAGES.KOI_CREATE_TRANSACTION_SUCCESS,
            data: { status: 403, data: 'Transaction rejected on closed.' },
            id
          }

          chrome.runtime.getPlatformInfo((info) => {
            let windowData

            if (info.os == 'win') {
              windowData = {
                url: chrome.extension.getURL('/popup.html'),
                focused: true,
                type: 'popup',
                height: 628,
                width: 426,
              }
            } else [
              windowData = {
                url: chrome.extension.getURL('/popup.html'),
                focused: true,
                type: 'popup',
                height: 628,
                width: 426,  
              }
            ]
            createWindow(
              windowData,
              {
                beforeCreate: async () => {
                  chrome.browserAction.setBadgeText({ text: '1' })
                  await setChromeStorage({
                    'pendingRequest': {
                      type: REQUEST.TRANSACTION,
                      data: { transaction, qty, address, origin, favicon, fee }
                    }
                  })
                },
                afterClose: async () => {
                  chrome.browserAction.setBadgeText({ text: '' })
                  port.postMessage(onClosedMessage)
                  await removeChromeStorage('pendingRequest')
                },
              }
            )
          })
          break
        }

        case MESSAGES.KOI_DISCONNECT: {
          let approvedSite = await storage.generic.get.connectedSites() || []
          if (hadPermission) approvedSite = approvedSite.filter(site => site !== origin)
          await storage.generic.set.connectedSite(approvedSite)
          port.postMessage({
            type: MESSAGES.KOI_DISCONNECT_SUCCESS,
            data: { status: 200, data: 'Disconnected.' },
            id: message.id
          })
          break
        }

        case MESSAGES.KOI_REGISTER_DATA: {
          const { txId } = message.data
          const resTx = await koi.registerData(txId, koi.address)
          port.postMessage({
            type: MESSAGES.KOI_REGISTER_DATA_SUCCESS,
            data: { status: 200, data: resTx },
            id: message.id
          })
          break
        }

        default:
          break
      }
    } catch (err) {
      console.log('ERROR: ', err.message)
      port.postMessage({
        type: MESSAGES.ERROR,
        data: err.message
      })
    }
  }

  await perform()

  pendingMessages[message.type] = undefined
}
