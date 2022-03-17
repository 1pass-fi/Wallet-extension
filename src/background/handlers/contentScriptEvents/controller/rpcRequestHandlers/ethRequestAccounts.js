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
    const { hadPermission, activatedAddress, origin, favicon } = tab
    
    console.log('hadPermission ethRequestAccounts', hadPermission)

    if (hadPermission) {
      /* Response with array of connected addresses */
      return next({ data: ['example_address_1, example_address_2'] })
    }

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

    const sleep = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve()
        }, 3000)
      })
    }

    createWindow(windowData, {
      beforeCreate: async () => {
        chrome.browserAction.setBadgeText({ text: '1' })
        chrome.runtime.onMessage.addListener(
          async function(popupMessage, _, sendResponse) {
            if (popupMessage.requestId === requestId) {
              console.log('Message from popup', popupMessage)

              const approved = popupMessage.approved
              if (approved) {
                // connect account
                try {
                  const checkedAddresses = popupMessage.checkedAddresses
  
                  const allAccounts = await backgroundAccount.getAllAccounts(TYPE.ETHEREUM)
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
