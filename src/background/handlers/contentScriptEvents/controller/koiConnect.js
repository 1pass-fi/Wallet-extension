import { TYPE } from 'constants/accountConstants'
// constants
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { backgroundAccount } from 'services/account'
// storage
import storage from 'services/storage'
// utils
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  const { hadPermission, origin, favicon, hasPendingRequest } = tab
  try {
    /* 
      check for having 0 imported account
    */
    const savedAccountCount = await backgroundAccount.count()
    if (!savedAccountCount) {
      const path = '/options.html'
      const url = chrome.runtime.getURL(path)
      next({ data: { status: 401, data: 'Please import your wallet.' } })
      chrome.scripting.create({ url })
      return
    } else {
      const arWalletCount = await backgroundAccount.count(TYPE.ARWEAVE)
      if (!arWalletCount) {
        next({ data: { status: 401, data: 'Please import an Arweave wallet to Finnie.' } })
        return
      }
    }

    if (!hadPermission) {
      if (hasPendingRequest) {
        next({ data: { status: 400, data: `Request pending` } })
        return
      }

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

      const requestId = uuid()
      const requestPayload = {
        origin,
        favicon,
        requestId,
        isEthereum: false
      }

      createWindow(windowData, {
        beforeCreate: async () => {
          chrome.action.setBadgeText({ text: '1' })
          chrome.runtime.onMessage.addListener(async function (popupMessage) {
            if (popupMessage.requestId === requestId) {
              const approved = popupMessage.approved
              if (approved) {
                try {
                  const checkedAddresses = popupMessage.checkedAddresses

                  let siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()

                  if (!siteConnectedAddresses[origin]) {
                    siteConnectedAddresses[origin] = { ethereum: [], arweave: [] }
                  }
                  siteConnectedAddresses[origin].arweave = checkedAddresses
                  await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)
                  await storage.setting.set.activatedArweaveAccountAddress(checkedAddresses[0])

                  chrome.runtime.sendMessage({
                    requestId,
                    finished: true
                  })

                  next({ data: { status: 200, message: siteConnectedAddresses[origin].arweave } })
                } catch (err) {
                  console.error(err.message)
                }
              } else {
                next({ data: { status: 400, message: 'User rejected' } })
              }
            }
          })

          await storage.generic.set.pendingRequest({
            type: REQUEST.PERMISSION,
            data: requestPayload
          })
        },
        afterClose: async () => {
          chrome.action.setBadgeText({ text: '' })
          next({ data: { status: 400, message: 'User cancelled the login.' } })
          await storage.generic.set.pendingRequest({})
        }
      })
    } else {
      next({ data: { status: 200, data: 'This site has already connected.' } })
    }
  } catch (err) {
    console.log(err.message)
    next({ data: { status: 500, data: 'Something went wrong.' } })
  }
}
