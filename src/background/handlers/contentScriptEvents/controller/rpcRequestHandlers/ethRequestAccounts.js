import { isEmpty, includes } from 'lodash'
import { v4 as uuid } from 'uuid'

import { backgroundAccount } from 'services/account'

import { TYPE } from 'constants/accountConstants'


// Services
import storage from 'services/storage'
import { createWindow } from 'utils/extension'
import { REQUEST, OS, WINDOW_SIZE } from 'constants/koiConstants'

export default async (payload, tab, next) => {
  try {
    const { hadPermission, origin, favicon, hasPendingRequest } = tab
    
    if (hadPermission) {
      /* Response with array of connected addresses */
      return next({ data: ['example_address_1, example_address_2'] })
    }

    if (hasPendingRequest) {
      return next({ error: 'Request pending' })
    }

    // check if there is an imported ethereum account
    const totalEthereumAccounts = await backgroundAccount.count(TYPE.ETHEREUM)
    if (!totalEthereumAccounts) {
      return next({ error: 'No imported ethereum account' })
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

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(
          async function(popupMessage, _, sendResponse) {
            if (popupMessage.requestId === requestId) {
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
  
                  next({ data: siteConnectedAddresses[origin].ethereum })
                } catch (err) {
                  console.error(err.message)
                }  
              } else {
                next({ error: 'Transaction rejected' })
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
        next({ error: 'User cancelled the login.' })
        await storage.generic.set.pendingRequest({})
      }
    })
  } catch (err) {
    next({ error: err.message })
  }
}
