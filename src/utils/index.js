import { loadKoiBy } from 'constant'

export const setChromeStorage = (obj) => {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.set(obj, () => {
      resolve()
    })
  })
}

export const getChromeStorage = (key) => {
  return new Promise(function(resolve, reject) {
    chrome.storage.local.get(key, (result) => {
      resolve(result)
    })
  })
}

export const loadWallet = async (koiObj, data, loadBy) => {
  try {
    switch(loadBy) {
      case loadKoiBy.ADDRESS:
        koiObj.address = data
        break
      case loadKoiBy.FILE:
        await koiObj.loadWallet(data)
        break
      case loadKoiBy.SEED:
        break
    }

    await koiObj.getWalletBalance()
    const koiBalance = await koiObj.getKoiBalance()

    return {
      arBalance: koiObj.balance,
      koiBalance: koiBalance,
      address: koiObj.address
    }
  } catch (err) {
    return err.message
  }
}

export const JSONFileToObject = async (file) => {
  const fileText = await file.text()
  return JSON.parse(fileText)
}
