export class ChromeStorage {
  _getChrome(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(key, result => {
        if (result[key]) {
          resolve(result[key])
          return
        }
        resolve(null)
      })
    })
  }

  _setChrome(key, value) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve()
      })
    })
  }

  _removeChrome(key) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(key, () => {
        resolve()
      })
    })
  }
}
