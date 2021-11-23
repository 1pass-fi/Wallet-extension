// constants
import { REQUEST, OS, WINDOW_SIZE } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// utils
import { createWindow } from 'utils/extension'

// storage
import storage from 'services/storage'
import { backgroundAccount } from 'services/account'

import { permissionId } from 'background'


export default async (payload, tab, next) => {
  const { id } = payload
  const { hadPermission, origin, favicon, hasPendingRequest } = tab
  try {
    /* 
      check for having 0 imported account
    */
    const savedAccountCount = await backgroundAccount.count()
    if (!savedAccountCount) {
      const path = '/options.html'
      const url = chrome.extension.getURL(path)
      next({ data: {status: 401, data: 'Please import your wallet.'} })
      chrome.tabs.create({ url })
      return
    } else {
      const arWalletCount = await backgroundAccount.count(TYPE.ARWEAVE)
      if (!arWalletCount) {
        next({ data: {status: 401, data: 'Please import an Arweave wallet to Finnie.'} })
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
            /* 
              Save pending request to chrome storage
            */
            await storage.generic.set.pendingRequest({
              type: REQUEST.PERMISSION,
              data: { origin, favicon, isKoi: true }
            })
          },
          afterClose: async () => {
            chrome.browserAction.setBadgeText({ text: '' })
            next({data: { status: 400, data: `Request rejected on closed` }})
            await storage.generic.set.pendingRequest(null)
          }
        }
      )
      permissionId.push(id)
    } else {
      next({ data: { status: 200, data: 'This site has already connected.' } })
    }
  } catch (err) {
    console.log(err.message)
    next({ data: { status: 500, data: 'Something went wrong.' } })
  } 
}
