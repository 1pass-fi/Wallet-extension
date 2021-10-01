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

export const getSelectedTab = (timeout = 200, retries = 0) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        chrome.tabs.getSelected(null, tab => {
          resolve(tab)
        })
      } catch (err) {
        reject(err)
      }
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
