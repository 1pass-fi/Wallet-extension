import { TYPE } from 'constants/accountConstants'
import { OS, REQUEST, WINDOW_SIZE } from 'constants/koiConstants'
import { includes,isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
// Services
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { v4 as uuid } from 'uuid'

export default async (payload, tab, next) => {
  try {
    const { hadPermission, origin, favicon, hasPendingRequest, connectedAddresses } = tab
    
    if (hadPermission) {
      /* Response with array of connected addresses */
      return next({ data: connectedAddresses })
    }

    if (hasPendingRequest) {
      return next({ error: { code: 4001, data: 'Request pending' } })
    }

    // check if there is an imported solana account
    const totalSolanaAccount = await backgroundAccount.count(TYPE.SOLANA)
    if (!totalSolanaAccount) {
      return next({ error: { code: 4001, data: 'No imported Solana account' } })
    }

    const requestId = uuid()

    /* 
      Save the request to local storage
    */
    const requestPayload = {
      origin,
      favicon,
      requestId,
      isSolana: true
    }

    const screen = (await chrome.system.display.getInfo())[0].bounds
    const screenWidth = screen.width
    const screenHeight = screen.height
    const os = (await chrome.runtime.getPlatformInfo()).os

    let windowData = {
      url: chrome.runtime.getURL('/popup.html'),
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

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(
          async function(popupMessage, _, sendResponse) {
            if (popupMessage.requestId === requestId) {
              const approved = popupMessage.approved
              if (approved) {
                // connect account
                var pendingRequest = await storage.generic.get.pendingRequest()
                if (isEmpty(pendingRequest)) {
                  next({ error: { code: 4001, data: 'Request has been removed' } })
                  chrome.runtime.sendMessage({
                    requestId,
                    error: 'Request has been removed'
                  })
                  return
                }
                try {
                  const checkedAddresses = popupMessage.checkedAddresses
  
                  let siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()
  
                  if (!siteConnectedAddresses[origin]) {
                    siteConnectedAddresses[origin] = { ethereum: [], arweave: [], solana: [] }
                  }
                  siteConnectedAddresses[origin].solana = checkedAddresses 
                  await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)
                  await storage.setting.set.activatedSolanaAccountAddress(checkedAddresses[0])

                  chrome.runtime.sendMessage({
                    requestId,
                    finished: true
                  })
  
                  next({ data: siteConnectedAddresses[origin].solana })
                } catch (err) {
                  console.error(err.message)
                }  
              } else {
                next({ error: {code: 4001, data: 'User rejected'} })
              }
            }
          }
        )
        await storage.generic.set.pendingRequest({
          type: REQUEST.PERMISSION,
          data: requestPayload 
        })

      },
      afterClose: async () => {
        chrome.browserAction.setBadgeText({ text: '' })
        next({ error: {code: 4001, data: 'User rejected'} })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
