import { OS } from 'constants/koiConstants'
import { getChromeStorage } from 'utils'

let currentWindow
let afterCloseCallbacks = {}

export const closeCurrentWindow = () => {
  return new Promise((resolve) => {
    if (currentWindow) {
      if (afterCloseCallbacks[currentWindow.id]) {
        afterCloseCallbacks[currentWindow.id]()
        afterCloseCallbacks[currentWindow.id] = undefined
      }
      chrome.windows.remove(currentWindow.id, () => {
        currentWindow = undefined
        resolve()
      })
    } else {
      resolve()
    }
  })
}

export const createWindow = (windowData, { beforeCreate = () => {}, afterClose = () => {} } = {}) => {
  closeCurrentWindow().then(() => {
    setTimeout(async () => {
      await beforeCreate()
      chrome.windows.create(windowData , w => {
        currentWindow = w
        afterCloseCallbacks[w.id] = afterClose
        chrome.windows.onRemoved.addListener(async wIndex => {
          if (afterCloseCallbacks[w.id]) {
            afterCloseCallbacks[w.id]()
            afterCloseCallbacks[w.id] = undefined
          }
        })
      })
    }, 500)
  })
}

export const getSelectedTab = (timeout = 0, retries = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (retries > 3) {
        reject('Unsupported url')
        return
      }
      chrome.tabs.getSelected(null, tab => {
        if (tab.url.startsWith('chrome-extension://')) {
          getSelectedTab(100, retries + 1).then(resolve).catch(reject)
        } else {
          resolve(tab)
        }
      })
    }, timeout)
  })
}

export const performOnDifferentOs = (win, others) => (payload) => {
  const os = window.localStorage.getItem(OS)
  if (os == 'win') {
    win(payload)
  } else {
    others(payload)
  }
}
