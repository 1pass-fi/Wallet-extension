let currentWindow

export const closeCurrentWindow = () => {
  return new Promise((resolve) => {
    if (currentWindow) {
      chrome.windows.remove(currentWindow.id, () => {
        currentWindow = undefined
        resolve()
      })
    } else {
      resolve()
    }
  })
}

export const createWindow = (windowData) => {
  closeCurrentWindow().then(() => {
    setTimeout(() => {
      chrome.windows.create(windowData , w => currentWindow = w)
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
          console.log('invalid tab url---', tab)
          getSelectedTab(100, retries + 1).then(resolve).catch(reject)
        } else {
          resolve(tab)
        }
      })
    }, timeout)
  })
}
