import { LOAD_KOI_BY } from 'constants'
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
      case LOAD_KOI_BY.ADDRESS:
        koiObj.address = data
        break
      case LOAD_KOI_BY.KEY:
        await koiObj.loadWallet(data)
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
    throw new Error(err.message)
  }
}

export const generateWallet = async (koiObj) => {
  try {
    await koiObj.generateWallet(true)
    return koiObj.mnemonic
  } catch (err) {
    throw new Error(err.message)
  }
}

export const loadMyContent = async (koiObj) => {
  try {
    console.log('ADDRESS', koiObj.address)
    const contentList = await koiObj.myContent()
    console.log('CONTENT LIST FROM UTILS', contentList)
    const resultList = contentList.map((content) => {
      return {
        name: content.title,
        isKoiWallet: content.ticker === 'KOINFT',
        earndKoi: content.totalReward,
        txId: content.txIdContent,
        path: `${PATH.NFT_IMAGE}/${content.txIdContent}`,
        isRegistered: true
      }
    })
    console.log(resultList)

    return resultList

  } catch (err) {
    throw new Error(err.message)
  }
}

export const saveWalletToChrome = async (koiObj, password) => {
  try {
    const encryptedWalletKey = await passworder.encrypt(password, koiObj.wallet)
    await setChromeStorage({ 'koiAddress': koiObj.address, 'koiKey': encryptedWalletKey })
  } catch (err) {
    throw new Error(err.message)
  }
}

export const decryptWalletKeyFromChrome = async (password) => {
  try {
    const result = await getChromeStorage('koiKey')
    const key = await passworder.decrypt(password, result['koiKey'])
    return key
  } catch (err) {
    throw new Error(err.message)
  }
}

export const removeWalletFromChrome = async () => {
  try {
    await removeChromeStorage('koiAddress')
    await removeChromeStorage('koiKey')
  } catch (err) {
    throw new Error(err.message)
  }
}

export const JSONFileToObject = async (file) => {
  try {
    const fileText = await file.text()
    return JSON.parse(fileText)
  } catch (err) {
    throw new Error(err.message)
  }
}

export const utils = {
  loadWallet
}
