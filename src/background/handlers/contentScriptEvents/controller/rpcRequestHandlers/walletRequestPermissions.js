import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
// Services
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const { hadPermission, origin, favicon } = tab

    // check if there is an imported ethereum account
    const hasImportedEthereum = false
    if (!hasImportedEthereum) {
    }

    const requestId = uuid()

    /* 
      Save the request to local storage
    */
    const requestPayload = {
      origin,
      favicon,
      requestId,
      isEthereum: true
    }

    const screen = (await chrome.system.display.getInfo())[0].bounds
    const screenWidth = screen.width
    const screenHeight = screen.height
    const os = (await chrome.runtime.getPlatformInfo()).os

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
        chrome.runtime.onMessage.addListener(async function (popupMessage, _, sendResponse) {
          if (popupMessage.requestId === requestId) {
            console.log('Message from popup', popupMessage)

            const approved = popupMessage.approved
            if (approved) {
              // connect account
              try {
                const checkedAddresses = popupMessage.checkedAddresses

                let siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()

                if (!siteConnectedAddresses[origin]) {
                  siteConnectedAddresses[origin] = { ethereum: [], arweave: [] }
                }
                siteConnectedAddresses[origin].ethereum = checkedAddresses
                await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)

                const permissions = [
                  {
                    caveats: [
                      {
                        type: 'restrictReturnedAccounts',
                        value: checkedAddresses
                      }
                    ],
                    date: Date.now(),
                    id: uuid(),
                    invoker: origin,
                    parentCapability: 'eth_accounts'
                  }]

                  chrome.runtime.sendMessage({
                    requestId,
                    finished: true
                  })
                  
                  next({ data: permissions })
                } catch (err) {
                  console.error(err.message)
                }  
              } else {
                next({ error: 'Request rejected' })
              }
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
        next({ error: 'User cancelled the login.' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
