import { loadKoiBy } from 'constant'
import passworder from 'browser-passworder'

export const setChromeStorage = (obj) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(obj, () => {
      resolve()
    })
  })
}

export const getChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, (result) => {
      resolve(result)
    })
  })
}

export const removeChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.remove(key, () => {
      resolve()
    })
  })
}

export const loadWallet = async (koiObj, data, loadBy) => {
  try {
    switch (loadBy) {
      case loadKoiBy.ADDRESS:
        koiObj.address = data
        break
      case loadKoiBy.FILE:
        data = await JSONFileToObject(data)
        await koiObj.loadWallet(data)
        break
      case loadKoiBy.SEED:
        await koiObj.loadWallet(data)
        break
      case loadKoiBy.KEY:
        await koiObj.loadWallet(data)
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

export const generateWallet = async (koiObj) => {
  try {
    await koiObj.generateWallet(true)
    return koiObj.mnemonic
  } catch (err) {
    return err.message
  }
}

export const saveWalletToChrome = async (koiObj, password) => {
  try {
    const encryptedWalletKey = await passworder.encrypt(password, koiObj.wallet)
    await setChromeStorage({ 'koiAddress': koiObj.address, 'koiKey': encryptedWalletKey })
  } catch (err) {
    return err.message
  }
}

export const decryptWalletKeyFromChrome = async (password) => {
  try {
    const result = await getChromeStorage('koiKey')
    console.log('RESULT KOIKEY', result['koiKey'])
    const key = await passworder.decrypt(password, result['koiKey'])
    return key
  } catch (err) {
    return err.message
  }
}

export const removeWalletFromChrome = async () => {
  try {
    await removeChromeStorage('koiAddress')
    await removeChromeStorage('koiKey')
  } catch (err) {
    return err.message
  }
}

export const JSONFileToObject = async (file) => {
  const fileText = await file.text()
  return JSON.parse(fileText)
}
