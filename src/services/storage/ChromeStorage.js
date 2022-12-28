export class ChromeStorage {
  _getChrome(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(key, result => {
          if (result[key] !== undefined) {
            resolve(result[key])
            return
          }
          resolve(null)
        })
      } catch (err) {
        resolve(null)
      }
    })
  }

  _setChrome(key, value) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set({ [key]: value }, () => {
          resolve()
        })
      } catch (err) {
        resolve()
      }
    })
  }

  _removeChrome(key) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.remove(key, () => {
          resolve()
        })
      } catch (err) {
        resolve()
      }
    })
  }
}
