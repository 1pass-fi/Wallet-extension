import { LOAD_KOI_BY, PATH, STORAGE } from 'constants'
import passworder from 'browser-passworder'
import axios from 'axios'

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

// export const loadMyContent = async (koiObj) => {
//   try {
//     console.log('ADDRESS', koiObj.address)
//     const contentList = await koiObj.myContent()
//     console.log('CONTENT LIST FROM UTILS', contentList)
//     const resultList = contentList.map((content) => {
//       return {
//         name: content.title,
//         isKoiWallet: content.ticker === 'KOINFT',
//         earndKoi: content.totalReward,
//         txId: content.txIdContent,
//         path: `${PATH.NFT_IMAGE}/${content.txIdContent}`,
//         isRegistered: true
//       }
//     })
//     console.log(resultList)

//     return resultList

//   } catch (err) {
//     throw new Error(err.message)
//   }
// }

export const loadMyContent = async (koiObj) => {
  try {
    let { data } = await axios.get('https://bundler.openkoi.com:8888/state/getTopContent')
    if (data === 0) {
      throw new Error('There are no contents.')
    }
    // data = data.filter(item => item.owner === koiObj.address)
    const resultData = data.map(content => {
      console.log('CONTENT', content)
      return {
        name: content.name,
        isKoiWallet: content.ticker === 'KOINFT',
        earnedKoi: content.totalReward,
        txId: content.txIdContent,
        imageUrl: `${PATH.NFT_IMAGE}/${content.txIdContent}`,
        galleryUrl: `${PATH.GALLERY}?id=${content.txIdContent}`,
        viewblockUrl: `${PATH.VIEW_BLOCK}/${content.txIdContent}`,
        isRegistered: true
      }
    })
    return resultData.slice(0, 7)
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
    await removeChromeStorage(STORAGE.KOI_ADDRESS)
    await removeChromeStorage(STORAGE.KOI_KEY)
    await removeChromeStorage(STORAGE.CONTENT_LIST)
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
