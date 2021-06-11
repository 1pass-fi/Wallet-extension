import { LOAD_KOI_BY, PATH, STORAGE, ERROR_MESSAGE } from 'koiConstants'
import passworder from 'browser-passworder'
import moment from 'moment'
import { get, isNumber, isArray } from 'lodash'

import Arweave from 'arweave'
import axios from 'axios'

/* istanbul ignore next */
const arweave = Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443, })
/* istanbul ignore next */

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

/* istanbul ignore next */
export const clearChromeStorage = (key) => {
  return new Promise(function (resolve, reject) {
    chrome.storage.local.clear(() => {
      resolve()
    })
  })
}

export const getBalances = async (koiObj) => {
  const [arBalance, koiBalance] = await Promise.all([koiObj.getWalletBalance(), koiObj.getKoiBalance()])

  koiObj.balance = arBalance
  await setChromeStorage({ [STORAGE.KOI_BALANCE]: koiBalance, [STORAGE.AR_BALANCE]: koiObj['balance'] })
  return {
    arBalance: koiObj.balance,
    koiBalance: koiBalance
  }
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

    return {
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
    const { data: allContent } = await axios.get(PATH.ALL_CONTENT)
    console.log({ allContent })
    const myContent = (allContent.filter(content => get(content[Object.keys(content)[0]], 'owner') === koiObj.address)).map(content => Object.keys(content)[0])
    const storage = await getChromeStorage(STORAGE.CONTENT_LIST)
    const contentList = storage[STORAGE.CONTENT_LIST] || []
    if (myContent.length === contentList.length) return
    return Promise.all(myContent.map(async contentId => {
      try {
        const { data: content } = await axios.get(`${PATH.SINGLE_CONTENT}/${contentId}`)
        const u8 = Buffer.from((await axios.get(`${PATH.NFT_IMAGE}${content.txIdContent}`, { responseType: 'arraybuffer'})).data, 'binary').toString('base64')
        const imageUrl = `data:image/jpeg;base64,${u8}`
  
        return {
          name: content.title,
          isKoiWallet: content.ticker === 'KOINFT',
          earnedKoi: content.totalReward,
          txId: content.txIdContent,
          imageUrl,
          galleryUrl: `${PATH.GALLERY}?id=${content.txIdContent}`,
          koiRockUrl: `${PATH.KOI_ROCK}${content.txIdContent}`,
          isRegistered: true
        }
      } catch (err) {
        return {
          isRegistered: true,
          isKoiWallet: true
        }
      }

    }))
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const loadMyActivities = async (koiObj, cursor) => {
  try {
    const { ownedCursor, recipientCursor } = cursor

    let ownedData
    let recipientData

    if (ownedCursor) {
      ownedData = get(await koiObj.getOwnedTxs(koiObj.address, 10, ownedCursor), 'data.transactions.edges')
    } else {
      ownedData = get(await koiObj.getOwnedTxs(koiObj.address), 'data.transactions.edges')
    }
  
    if (recipientCursor) {
      recipientData = get(await koiObj.getRecipientTxs(koiObj.address, 10, recipientCursor), 'data.transactions.edges')
    } else {
      recipientData = get(await koiObj.getRecipientTxs(koiObj.address), 'data.transactions.edges')
    }
  
    let activitiesList = [...ownedData, ...recipientData]

    const nextOwnedCursor = ownedData.length > 0 ? get(ownedData[ownedData.length - 1], 'cursor') : ownedCursor
    const nextRecipientCursor = recipientData.length > 0 ? get(recipientData[recipientData.length - 1], 'cursor') : recipientCursor

    if (activitiesList.length > 0) {
      activitiesList = activitiesList.filter(activity => !!get(activity, 'node.block')).map(activity => {
        const time = get(activity, 'node.block.timestamp')
        const timeString = isNumber(time) ? moment(time*1000).format('MMMM DD YYYY') : ''
        const id = get(activity, 'node.id')
        let activityName = 'Sent AR'
        let expense = Number(get(activity, 'node.quantity.ar')) + Number(get(activity, 'node.fee.ar'))
        // get input tag
        let inputTag = (get(activity, 'node.tags'))
        if (!isArray(inputTag)) inputTag = []
        inputTag = inputTag.filter(tag => tag.name === 'Input')
        const initStateTag = (get(activity, 'node.tags')).filter(tag => tag.name === 'Init-State')
        let source = get(activity, 'node.recipient')
        let inputFunction
        if (inputTag[0]) {
          inputFunction = JSON.parse(inputTag[0].value)
          if (inputFunction.function === 'transfer' || inputFunction.function === 'mint') {
            activityName = 'Sent KOI'
            expense = inputFunction.qty
            source = inputFunction.target
          }

          if (inputFunction.function === 'registerData') {
            activityName = 'Registered NFT'
            source = null
          }
        }

        if (initStateTag[0]) {
          const initState = JSON.parse(initStateTag[0].value)
          activityName = `Purchased "${initState.title}"`
        }

        if (get(activity, 'node.owner.address') !== koiObj.address) {
          activityName = 'Received AR'
          source = get(activity, 'node.owner.address')
          expense -= Number(get(activity, 'node.fee.ar'))
          if (inputTag[0]) {
            inputFunction = JSON.parse(inputTag[0].value)
            if (inputFunction.function === 'transfer' || inputFunction.function === 'mint') {
              activityName = 'Received KOI'
              expense = inputFunction.qty
              source = inputFunction.target
            }
          }
        }

        return {
          id,
          activityName,
          expense,
          accountName: 'Account 1',
          date: timeString,
          source
        }
      })
    }
    return { activitiesList, nextOwnedCursor, nextRecipientCursor }
  } catch(err) {
    throw new Error(err.message)
  }
}

export const transfer = async (koiObj, qty, address, currency) => {
  try {
    let balance
    switch (currency) {
      case 'KOI':
        balance = await koiObj.getKoiBalance()
        if (qty > balance) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_KOI)
        break
      case 'AR':
        balance = await koiObj.getWalletBalance()
        if (qty > balance) throw new Error(ERROR_MESSAGE.NOT_ENOUGH_AR)
        break
    }
    const txId = await koiObj.transfer(qty, address, currency)
    return txId

  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const saveWalletToChrome = async (koiObj, password) => {
  try {
    const encryptedWalletKey = await passworder.encrypt(password, koiObj.wallet)
    await setChromeStorage({ 'koiAddress': koiObj.address, 'koiKey': encryptedWalletKey })
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const decryptWalletKeyFromChrome = async (password) => {
  try {
    const result = await getChromeStorage(STORAGE.KOI_KEY)
    const key = await passworder.decrypt(password, result[STORAGE.KOI_KEY])
    return key
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const decryptSeedPhraseFromChrome = async (password) => {
  try {
    const result = await getChromeStorage(STORAGE.KOI_PHRASE)
    if (!result[STORAGE.KOI_PHRASE]) return
    const phrase = await passworder.decrypt(password, result[STORAGE.KOI_PHRASE])
    return phrase
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
export const removeWalletFromChrome = async () => {
  try {
    await Promise.all(Object.keys(STORAGE).map(key => removeChromeStorage(key)))
  } catch (err) {
    throw new Error(err.message)
  }
}

/* istanbul ignore next */
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

/* istanbul ignore next */
export const signTransaction = async (koiObj, transaction) => {
  try {
    const tx = await arweave.createTransaction({ target: transaction.target, quantity: transaction.quantity })
    return await koiObj.signTransaction(tx)
  } catch (err) {
    console.log(err.message)
  }
}

export const utils = {
  loadWallet,
  setChromeStorage,
  getChromeStorage
}

export const numberFormat = (num) => {
  return num === null ? '---' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(num)
}

export const fiatCurrencyFormat = (num) => {
  return num === null ? '---' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 8 }).format(num)
}

export const transactionAmountFormat = (num) => {
  return num === null ? '---' : `${Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6)}`
}
