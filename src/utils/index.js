import { LOAD_KOI_BY, PATH, STORAGE, ERROR_MESSAGE } from 'koiConstants'
import passworder from 'browser-passworder'

/* istanbul ignore next */
export const setChromeStorage = (obj) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.set(obj, () => {
      resolve()
    })
  })
}

/* istanbul ignore next */
export const getChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.get(key, (result) => {
      resolve(result)
    })
  })
}

/* istanbul ignore next */
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

    koiObj.balance = await koiObj.getWalletBalance()
    console.log('AR BALANCE', koiObj.balance)
    const koiBalance = await koiObj.getKoiBalance()

    await setChromeStorage({ 'koiBalance': koiBalance, 'arBalance': koiObj['balance'] })

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
    const contentList = await koiObj.myContent()
    const resultList = contentList.map((content) => {
      return {
        name: content.title,
        isKoiWallet: content.ticker === 'KOINFT',
        earnedKoi: content.totalReward,
        txId: content.txIdContent,
        imageUrl: `${PATH.NFT_IMAGE}/${content.txIdContent}`,
        galleryUrl: `${PATH.GALLERY}?id=${content.txIdContent}`,
        koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
        isRegistered: true
      }
    })
    return resultList

  } catch (err) {
    throw new Error(err.message)
  }
}

export const loadMyActivities = async (koiObj) => {
  return [
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    }
  ]
}

export const transfer = async (koiObj, qty, address) => {
  try {
    const koiBalance = await koiObj.getKoiBalance()
    if (qty > koiBalance) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
    return await koiObj.transfer(qty, address)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const saveWalletToChrome = async (koiObj, password) => {
  try {
    const encryptedWalletKey = await passworder.encrypt(password, koiObj.wallet)
    console.log('ENCRYPTED KEY', encryptedWalletKey)
    await setChromeStorage({ 'koiAddress': koiObj.address, 'koiKey': encryptedWalletKey })
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const decryptWalletKeyFromChrome = async (password) => {
  try {
    const result = await getChromeStorage('koiKey')
    const key = await passworder.decrypt(password, result['koiKey'])
    return key
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const removeWalletFromChrome = async () => {
  try {
    await removeChromeStorage(STORAGE.KOI_ADDRESS)
    await removeChromeStorage(STORAGE.KOI_KEY)
    await removeChromeStorage(STORAGE.CONTENT_LIST)
    await removeChromeStorage(STORAGE.PENDING_REQUEST)
    await removeChromeStorage(STORAGE.SITE_PERMISSION)
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

/* istanbul ignore next */
export const checkSitePermission = async (origin) => {
  try {
    let approvedOrigin = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    if (!approvedOrigin) approvedOrigin = []
    return approvedOrigin.includes(origin)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const saveOriginToChrome = async (origin) => {
  try {
    let approvedOrigin = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    if (!approvedOrigin) approvedOrigin = []
    approvedOrigin.push(origin)
    await setChromeStorage({ 'sitePermission': approvedOrigin })
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const deleteOriginFromChrome = async (aOrigin) => {
  try {
    let approvedOrigin = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    if (!approvedOrigin) approvedOrigin = []
    approvedOrigin = approvedOrigin.filter(origin => origin !== aOrigin)
    await setChromeStorage({ 'sitePermission': approvedOrigin })
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

export const utils = {
  loadWallet
}
