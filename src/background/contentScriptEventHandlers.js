import { REQUEST, MESSAGES } from 'koiConstants'
import { checkSitePermission, setChromeStorage, transfer } from 'utils'
import { isInteger, isString } from 'lodash'

let pendingMessages = {}

export default async (koi, port, message, ports, resolveId) => {
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
      if (![MESSAGES.GET_PERMISSION, MESSAGES.CREATE_TRANSACTION, MESSAGES.CONNECT].includes(message.type)) {
        if (!hadPermission) {
          port.postMessage({
            type: `${message.type}_ERROR`,
            data: 'You don\'t have enough permissions to perform this action',
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
        case MESSAGES.GET_PERMISSION: {
          if (hadPermission) {
            port.postMessage({
              type: MESSAGES.GET_PERMISSION_SUCCESS,
              data: ['SIGN_TRANSACTION'],
              id: message.id
            })
          } else {
            port.postMessage({
              type: MESSAGES.GET_PERMISSION_SUCCESS,
              data: [],
              id: message.id
            })
          }
          // if (!hadPermission) {
          //   await setChromeStorage({
          //     'pendingRequest': {
          //       type: REQUEST.PERMISSION,
          //       data: { origin, favicon }
          //     }
          //   })
          // chrome.windows.create({
          //   url: chrome.extension.getURL('/popup.html'),
          //   focused: true,
          //   type: 'popup',
          //   height: 622,
          //   width: 426
          // })
          // }
          break
        }
        case MESSAGES.CONNECT: {
          console.log('MESSAGE.CONNECT BACKGROUND')
          const { id } = message
          const { permissionId } = resolveId
          permissionId.push(id)
          console.log('ORIGIN BACKGROUND', origin)
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
