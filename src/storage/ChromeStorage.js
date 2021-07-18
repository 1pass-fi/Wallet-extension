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
    console.log({[key]: value})
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

export class WalletChromeStorage extends ChromeStorage {
  #network
  constructor(network) {
    super()
    this.#network = network
  }

  _getKeyWord(key) {
    return `${this.#network}_${key}`
  }
}
