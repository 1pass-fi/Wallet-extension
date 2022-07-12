import {
  LOAD_KOI_BY,
  PATH,
  STORAGE,
  ERROR_MESSAGE,
  NFT_BIT_DATA,
  ALL_NFT_LOADED,
  ETH_NETWORK_NAME,
  ETH_NETWORK_PROVIDER,
  ATTENTION_CONTRACT
} from 'constants/koiConstants'
import passworder from 'browser-passworder'
import moment from 'moment'
import { get, isArray, isEmpty, isNumber } from 'lodash'
import capitalize from 'lodash/capitalize'

import Arweave from 'arweave/node'
import axios from 'axios'

import { Web } from '@_koi/sdk/web'

import passworder from 'browser-passworder'
import {
  ALL_NFT_LOADED,
  ATTENTION_CONTRACT,
  ERROR_MESSAGE,
  ETH_NETWORK_NAME,
  ETH_NETWORK_PROVIDER,
  LOAD_KOI_BY,
  NFT_BIT_DATA,
  PATH,
  STORAGE
} from 'constants/koiConstants'
import { ethers } from 'ethers'
import { get, isArray, isEmpty, isNumber } from 'lodash'
import capitalize from 'lodash/capitalize'
import moment from 'moment'
import { koiTools } from 'services/arweave'
export const koi = new Web()

import { PublicKey } from '@solana/web3.js'
import MetamaskABI from 'abi/MetamaskABI.json'
import { TYPE } from 'constants/accountConstants'
import { TRANSACTION_METHOD } from 'popup/components/SignTransaction/hooks/constants'
import storage from 'services/storage'
// import Web3 from 'web3'
import { ethers } from 'ethers'

/* istanbul ignore next */
const arweave = Arweave.init({ host: 'arweave.net', protocol: 'https', port: 443 })
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
  const [arBalance, koiBalance] = await Promise.all([
    koiObj.getWalletBalance(),
    koiObj.getKoiBalance()
  ])
  koiObj.balance = arBalance

  await storage.arweaveWallet.set.balance(koiObj['balance'])
  await storage.generic.set.koiBalance(koiBalance)

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
    const myContent = allContent
      .filter((content) => get(content[Object.keys(content)[0]], 'owner') === koiObj.address)
      .map((content) => Object.keys(content)[0])
    console.log({ myContent })
    const contentList = (await storage.arweaveWallet.get.assets()) || []
    if (myContent.length === contentList.length) return ALL_NFT_LOADED
    return Promise.all(
      myContent.map(async (contentId) => {
        try {
          console.log(`${PATH.SINGLE_CONTENT}${contentId}`)
          const { data: content } = await axios.get(`${PATH.SINGLE_CONTENT}${contentId}`)
          console.log({ content })
          if (content.title) {
            let url = `${PATH.NFT_IMAGE}/${content.txIdContent}`
            if (content.fileLocation) url = content.fileLocation
            const u8 = Buffer.from(
              (await axios.get(url, { responseType: 'arraybuffer' })).data,
              'binary'
            ).toString('base64')
            let imageUrl = `data:image/jpeg;base64,${u8}`
            if (content.contentType.includes('video')) imageUrl = `data:video/mp4;base64,${u8}`
            return {
              name: content.title,
              isKoiWallet: content.ticker === 'KOINFT',
              earnedKoi: content.totalReward,
              txId: content.txIdContent,
              imageUrl,
              galleryUrl: `${PATH.GALLERY}#/details/${content.txIdContent}`,
              koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
              isRegistered: true,
              contentType: content.contentType,
              totalViews: content.totalViews,
              createdAt: content.createdAt,
              description: content.description
            }
          } else {
            console.log('Failed load content: ', content)
            return {
              name: '...',
              isKoiWallet: true,
              earnedKoi: content.totalReward,
              txId: content.txIdContent,
              imageUrl: 'https://koi.rocks/static/media/item-temp.49349b1b.jpg',
              galleryUrl: `${PATH.GALLERY}#/details/${content.txIdContent}`,
              koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
              isRegistered: true,
              contentType: content.contentType || 'image',
              totalViews: content.totalViews,
              createdAt: content.createdAt,
              description: content.description
            }
          }
        } catch (err) {
          console.log(err.message)
          return {
            isRegistered: false,
            isKoiWallet: false
          }
        }
      })
    )
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

    // fetch data base on inputed cursors
    if (ownedCursor) {
      ownedData =
        get(await koiObj.getOwnedTxs(koiObj.address, 10, ownedCursor), 'data.transactions.edges') ||
        []
    } else {
      ownedData = get(await koiObj.getOwnedTxs(koiObj.address), 'data.transactions.edges') || []
    }

    if (recipientCursor) {
      recipientData =
        get(
          await koiObj.getRecipientTxs(koiObj.address, 10, recipientCursor),
          'data.transactions.edges'
        ) || []
    } else {
      recipientData =
        get(await koiObj.getRecipientTxs(koiObj.address), 'data.transactions.edges') || []
    }

    let activitiesList = [...ownedData, ...recipientData]
    console.log('ACTIVITIES LIST BACKGROUND: ', activitiesList)
    // get next cursors
    const nextOwnedCursor =
      ownedData.length > 0 ? get(ownedData[ownedData.length - 1], 'cursor') : ownedCursor
    const nextRecipientCursor =
      recipientData.length > 0
        ? get(recipientData[recipientData.length - 1], 'cursor')
        : recipientCursor

    if (activitiesList.length > 0) {
      // filter activities has node.block (success fetched activities) field then loop through to get necessary fields
      activitiesList = activitiesList
        .filter((activity) => !!get(activity, 'node.block'))
        .map((activity) => {
          const time = get(activity, 'node.block.timestamp')
          const timeString = isNumber(time) ? moment(time * 1000).format('MMMM DD YYYY') : ''
          const id = get(activity, 'node.id')
          let activityName = 'Sent AR'
          let expense =
            Number(get(activity, 'node.quantity.ar')) + Number(get(activity, 'node.fee.ar'))

          // get input tag
          let inputTag = get(activity, 'node.tags')
          if (!isArray(inputTag)) inputTag = []
          inputTag = inputTag.filter((tag) => tag.name === 'Input')

          // get Init State tag
          const initStateTag = get(activity, 'node.tags').filter((tag) => tag.name === 'Init-State')

          // get action tag
          const actionTag = get(activity, 'node.tags').filter((tag) => tag.name === 'Action')
          let source = get(activity, 'node.recipient')
          let inputFunction
          if (inputTag[0]) {
            inputFunction = JSON.parse(inputTag[0].value)
            if (inputFunction.function === 'transfer' || inputFunction.function === 'mint') {
              activityName = 'Sent KOII'
              expense = inputFunction.qty
              source = inputFunction.target
            } else if (inputFunction.function === 'updateCollection') {
              activityName = 'Updated Collection'
            } else if (inputFunction.function === 'updateKID') {
              activityName = 'Updated KID'
            }

            if (inputFunction.function === 'registerData') {
              activityName = 'Registered NFT'
              source = null
            }
          }

          if (initStateTag[0]) {
            if (actionTag[0].value.includes('KID/Create')) {
              const initState = JSON.parse(initStateTag[0].value)
              activityName = `Created KID "${initState.name}"`
            } else if (actionTag[0].value.includes('Collection/Create')) {
              const initState = JSON.parse(initStateTag[0].value)
              activityName = `Created Collection "${initState.name}"`
            } else {
              const initState = JSON.parse(initStateTag[0].value)
              activityName = `Minted NFT "${initState.title}"`
            }
          }

          if (get(activity, 'node.owner.address') !== koiObj.address) {
            activityName = 'Received AR'
            source = get(activity, 'node.owner.address')
            expense -= Number(get(activity, 'node.fee.ar'))
            if (inputTag[0]) {
              inputFunction = JSON.parse(inputTag[0].value)
              if (inputFunction.function === 'transfer' || inputFunction.function === 'mint') {
                activityName = 'Received KOII'
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
  } catch (err) {
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
    await setChromeStorage({ koiAddress: koiObj.address, koiKey: encryptedWalletKey })
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
    await Promise.all(Object.keys(STORAGE).map((key) => removeChromeStorage(key)))
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
export const signTransaction = async (koiObj, transaction) => {
  try {
    let tx
    console.log({ transaction })
    if (transaction.data) {
      console.log('TRANSACTION WITH DATA')
      transaction.data = JSON.parse(transaction.data)
      const data = Uint8Array.from(Object.values(transaction.data))
      tx = await arweave.createTransaction({ data })
      tx.data_root = transaction.data_root
      const { tags } = transaction
      tags.forEach((tag) => {
        console.log('TAG', atob(tag.name), atob(tag.value))
        tx.addTag(atob(tag.name), atob(tag.value))
      })
    } else {
      console.log('TRANSFER TRANSACTION')
      tx = await arweave.createTransaction({
        target: transaction.target,
        quantity: transaction.quantity
      })
    }
    console.log({ tx })
    console.log(await arweave.transactions.getPrice(tx.data_size))
    const result = await koiObj.signTransaction(tx)
    result.data = []
    return result
  } catch (err) {
    console.log(err.message)
  }
}

export const numberFormat = (num, digit) => {
  return num === null || num === undefined || isNaN(num)
    ? '---'
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: digit || 4 }).format(num)
}

export const fiatCurrencyFormat = (num) => {
  return num === null || num === undefined || isNaN(num)
    ? '---'
    : new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num)
}

export const transactionAmountFormat = (num) => {
  return num === null || num === undefined || isNaN(num)
    ? '---'
    : `${Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6)}`
}

export const getAccountName = async () => {
  const name = await storage.arweaveWallet.get.accountName()
  return name
}

export const updateAccountName = async (name) => {
  await storage.arweaveWallet.set.accountName(name)
  return name
}

export const loadNFTCost = async (size, address) => {
  const price = await arweave.transactions.getPrice(size, address)
  return price / 1000000000000
}

export const getImageDataForNFT = async (fileType) => {
  try {
    const storage = await getChromeStorage(NFT_BIT_DATA)
    let bitObject = storage[NFT_BIT_DATA]
    console.log('background- bitObject', storage)
    if (!bitObject) return
    // parse the JSON string on local storage
    bitObject = JSON.parse(bitObject)
    console.log('bitObject', bitObject)
    // create 8 bit array from bit object
    const u8 = Uint8Array.from(Object.values(bitObject))
    console.log('u8', u8)
    // create blob from u8
    const blob = new Blob([u8], { type: 'contentType' })
    console.log('blob', blob)
    // create file from blob
    const file = new File([blob], 'filename', { type: fileType })
    console.log(file)
    return { u8, file }
  } catch (err) {
    throw new Error(err.message)
  }
}

export const exportNFTNew = async (koi, arweave, content, tags, fileType) => {
  try {
    const { u8 } = await getImageDataForNFT(fileType)

    const balances = {}
    balances[koi.address] = 1

    let d = new Date()
    let createdAt = Math.floor(d.getTime() / 1000).toString()
    const initialState = {
      owner: koi.address,
      title: content.title,
      name: content.name,
      description: content.description,
      ticker: 'KOINFT',
      balances: balances,
      contentType: fileType,
      createdAt: createdAt,
      tags: tags,
      locked: []
    }

    let tx

    tx = await arweave.createTransaction({
      data: u8
    })

    tx.addTag('Content-Type', fileType)
    tx.addTag('Network', 'Koii')
    tx.addTag('Action', 'marketplace/Create')
    tx.addTag('App-Name', 'SmartWeaveContract')
    tx.addTag('App-Version', '0.3.1')
    tx.addTag('Contract-Src', 'r_ibeOTHJW8McJvivPJjHxjMwkYfAKRjs-LjAeaBcLc')
    tx.addTag('Init-State', JSON.stringify(initialState))
    tx.addTag('NSFW', content.isNSFW)

    try {
      await arweave.transactions.sign(tx, koi.wallet)
    } catch (err) {
      console.log('transaction sign error')
      console.log('err-sign', err)
      throw new Error(err.message)
    }
    console.log(tx)

    const registrationData = await getRegistrationReward(koi, tx.id)
    console.log('REGISTER REWARD: ', registrationData)

    let uploader = await arweave.transactions.getUploader(tx)
    console.log('uploader', uploader)

    // Upload progress

    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      console.log(
        uploader.pctComplete + '% complete',
        uploader.uploadedChunks + '/' + uploader.totalChunks
      )
    }

    if (registrationData.status !== 200) {
      console.log('BURN KOII', await koi.burnKoiAttention(tx.id))
      console.log('MIGRATE', await koi.migrateAttention())
    }
    return { txId: tx.id, time: createdAt }
  } catch (err) {
    console.log(err.message)
    throw new Error(err.message)
  }
}

export const createNewKid = async (koi, kidInfo, fileType) => {
  const { u8 } = await getImageDataForNFT(fileType)
  const image = { blobData: u8, contentType: fileType }

  const txId = await koi.createKID(kidInfo, image)
  return txId
}

export const updateKid = async (koi, kidInfo, contractId) => {
  return await koi.updateKID(kidInfo, contractId)
}

export const getProviderUrlFromName = (name) => {
  switch (name) {
    case ETH_NETWORK_NAME.MAINNET:
      return ETH_NETWORK_PROVIDER.MAINNET
    case ETH_NETWORK_NAME.ROPSTEN:
      return ETH_NETWORK_PROVIDER.ROPSTEN
    case ETH_NETWORK_NAME.KOVAN:
      return ETH_NETWORK_PROVIDER.KOVAN
    case ETH_NETWORK_NAME.GOERLI:
      return ETH_NETWORK_PROVIDER.GOERLI
  }
}
export const getProviderNameFromUrl = (name) => {
  switch (name) {
    case ETH_NETWORK_PROVIDER.MAINNET:
      return ETH_NETWORK_NAME.MAINNET
    case ETH_NETWORK_PROVIDER.ROPSTEN:
      return ETH_NETWORK_NAME.ROPSTEN
    case ETH_NETWORK_PROVIDER.KOVAN:
      return ETH_NETWORK_NAME.KOVAN
    case ETH_NETWORK_PROVIDER.GOERLI:
      return ETH_NETWORK_NAME.GOERLI
  }
}

export const utils = {
  loadWallet,
  setChromeStorage,
  getChromeStorage,
  removeChromeStorage
}

export const getAffiliateCode = async (koi) => {
  try {
    const signedPayload = await koi.signPayload({ data: { address: koi.address } })
    const { data } = await axios({
      method: 'POST',
      url: PATH.AFFILIATE_REGISTER,
      data: {
        address: koi.address,
        signature: signedPayload.signature,
        publicKey: signedPayload.owner
      }
    })

    return get(data, 'data.affiliateCode')
  } catch (err) {
    console.log(err.message)
    throw new Error('Cannot get affiliateCode')
  }
}

export const claimReward = async (koi) => {
  try {
    const signedPayload = await koi.signPayload({ data: { address: koi.address } })
    const { data } = await axios({
      method: 'POST',
      url: PATH.AFFILIATE_CLAIM_REWARD,
      data: {
        address: koi.address,
        signature: signedPayload.signature,
        publicKey: signedPayload.owner
      }
    })
    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getRegistrationReward = async (koi, nftId) => {
  console.log('NFT ID: ', nftId)
  try {
    const signedPayload = await koi.signPayload({ data: { address: koi.address } })
    const { data } = await axios({
      method: 'POST',
      url: PATH.AFFILIATE_REGISTRATION_REWARD,
      data: {
        address: koi.address,
        signature: signedPayload.signature,
        publicKey: signedPayload.owner,
        nftId
      }
    })

    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const submitInviteCode = async (koi, code) => {
  try {
    const signedPayload = await koi.signPayload({ data: { address: koi.address, code } })
    const { data } = await axios({
      method: 'POST',
      url: PATH.AFFILIATE_SUBMIT_CODE,
      data: {
        address: koi.address,
        code,
        signature: signedPayload.signature,
        publicKey: signedPayload.owner
      }
    })

    return data
  } catch (err) {
    throw new Error(err.message)
  }
}

export const getTotalRewardKoi = async (koi) => {
  try {
    const { data } = await axios({
      method: 'POST',
      url: PATH.AFFILIATE_TOTAL_REWARD,
      data: {
        address: [koi.address]
      }
    })
    if (status !== 200) {
      return 0
    }

    return get(data, 'data.totalReward')
  } catch (err) {
    throw new Error(err.message)
  }
}

export const checkAffiliateInviteSpent = async (koi) => {
  try {
    const signedPayload = await koi.signPayload({ data: { address: koi.address, code: 'code' } })
    const { data } = await axios({
      method: 'POST',
      url: PATH.AFFILIATE_SUBMIT_CODE,
      data: {
        address: koi.address,
        code: 'code',
        signature: signedPayload.signature,
        publicKey: signedPayload.owner
      }
    })

    if (data.message.toLowerCase().includes('already exists')) {
      return true
    }
  } catch (err) {
    throw new Error(err.message)
  }
}

export const saveUploadFormData = async (file, metadata) => {
  try {
    const url = URL.createObjectURL(file)
    const fileType = file.type
    const fileName = file.name

    const response = await fetch(url)
    const blob = await response.blob()
    const dataBuffer = await blob.arrayBuffer()

    let u8 = new Int8Array(dataBuffer)
    u8 = JSON.stringify(u8, null, 2)

    const payload = {
      data: u8,
      fileType,
      fileName,
      metadata
    }

    await storage.generic.set.savedNFTForm(payload)
  } catch (err) {
    await setChromeStorage({ [STORAGE.NFT_UPLOAD_DATA]: {} })
  }
}

export const getOldWallet = async (password) => {
  const encryptedKey = (await getChromeStorage('koiKey'))['koiKey']
  const encryptedSeedphrase = (await getChromeStorage('koiPhrase'))['koiPhrase']
  let key, seedphrase

  if (encryptedKey) {
    key = await passworder.decrypt(password, encryptedKey)
  }

  if (encryptedSeedphrase) {
    seedphrase = await passworder.decrypt(password, encryptedSeedphrase)
  }
  return { key, seedphrase }
}

export const winstonToAr = (value) => {
  return value / 1000000000000
}

export const calculateGasFee = async ({ amount, senderAddress, toAddress, provider }) => {
  // const web3 = new Web3()
  koiTools.initializeEvmWalletAndProvider(senderAddress, provider)

  let amountToSend
  if (amount) {
    // amountToSend = web3.utils.toWei(amount.toString(), 'ether') // Convert to wei value
    amountToSend = ethers.utils.parseEther(amount.toString(), 'ether') // Convert to wei value
  }

  const rawTx = {
    to: toAddress,
    value: amountToSend,
    gas: 0
  }
  return koiTools.estimateGasEvm(rawTx)
}

export const getAddressesFromAddressBook = async (type) => {
  const currentAB = (await storage.generic.get.addressBook()) || []
  let options = []

  for (const i in currentAB) {
    currentAB[i].addresses?.map((address, index) => {
      const addressName = isEmpty(address.name)
        ? currentAB[i].name
        : currentAB[i].name + ' (' + address?.name + ')'
      if (type) {
        switch (type) {
          case TYPE.K2:
          case TYPE.SOLANA:
            if (address.type === TYPE.K2)
              options.push({
                id: currentAB[i].id + index,
                accountName: addressName,
                address: address.value,
                type: address.type
              })
            break

          default:
            if (address.type === type) {
              options.push({
                id: currentAB[i].id + index,
                accountName: addressName,
                address: address.value,
                type: address.type
              })
            }
            break
        }
      } else {
        options.push({
          id: currentAB[i].id + index,
          accountName: addressName,
          address: address.value,
          type: address.type
        })
      }
    })
  }

  // remove invalid addresses
  options = options?.filter((address) => {
    return !isEmpty(address.address)
  })

  return options
}

export const isArweaveAddress = (arAddress) => {
  const arAddressRegex = new RegExp('^[A-Za-z0-9-_]+$')
  const isValidCharacters = arAddressRegex.test(arAddress)
  const isValidLength = arAddress.length === 43

  return isValidCharacters && isValidLength
}

export const isEthereumAddress = (ethAddress) => {
  try {
    // return Web3.utils.isAddress(ethAddress?.toUpperCase())
    return ethers.utils.isAddress(ethAddress)
  } catch (error) {
    console.log('Failed to verify Ethereum Address: ', ethAddress, error.message)
    return false
  }
}

export const isSolanaAddress = (solAddress) => {
  try {
    const publicKey = new PublicKey(solAddress)
    return PublicKey.isOnCurve(publicKey)
  } catch (error) {
    console.log('Failed to verify Solana Address: ', solAddress, error.message)
    return false
  }
}

export const calculateArFee = async (dataSize) => {
  const fee = await arweave.transactions.getPrice(dataSize)
  return winstonToAr(fee)
}

export const setActivatedAccountAddress = async (address, type) => {
  switch (type) {
    case TYPE.ARWEAVE:
      await storage.setting.set.activatedArweaveAccountAddress(address)
      break

    case TYPE.ETHEREUM:
      await storage.setting.set.activatedEthereumAccountAddress(address)
      break

    case TYPE.SOLANA:
      await storage.setting.set.activatedSolanaAccountAddress(address)
      break

    case TYPE.K2:
      await storage.setting.set.activatedK2AccountAddress(address)
      break

    default:
      console.log('Failed to set activated account address: ', address, type)
      break
  }
}

export const getSiteConnectedAddresses = async (accountAddress, accountType) => {
  const siteConnectedStorage = await storage.setting.get.siteConnectedAddresses()
  let siteAddresses = []

  for (const [key, value] of Object.entries(siteConnectedStorage)) {
    const origin = capitalize(key.split('/')[2])
    if (accountType === TYPE.ARWEAVE) {
      if (value.arweave?.includes(accountAddress)) {
        siteAddresses.push({ origin: origin, address: key })
      }
    }
    if (accountType === TYPE.ETHEREUM) {
      if (value.ethereum?.includes(accountAddress)) {
        siteAddresses.push({ origin: origin, address: key })
      }
    }
    if (accountType === TYPE.SOLANA) {
      if (value.solana?.includes(accountAddress)) {
        siteAddresses.push({ origin: origin, address: key })
      }
    }
    if (accountType === TYPE.K2) {
      if (value.k2?.includes(accountAddress)) {
        siteAddresses.push({ origin: origin, address: key })
      }
    }
  }

  return siteAddresses
}

export const fromArToWinston = (value) => value * 1000000000000
export const fromWinstonToAr = (value) => value / 1000000000000
export const fromEthToWei = (value) => value * 1000000000000000000
export const fromWeiToEth = (value) => value / 1000000000000000000
export const fromSolToLamp = (value) => value * 1000000000
export const fromLampToSol = (value) => value / 1000000000

export const clarifyEthereumProvider = (ethProvider) => {
  try {
    let ethNetwork, apiKey
    const providerArray = ethProvider.split('/')
    apiKey = providerArray[4]
    ethNetwork = providerArray[2].split('.')[0]
    return { ethNetwork, apiKey }
  } catch (err) {
    console.error('Failed to clarify Ethereum Provider - error: ', err.message)
    return { ethNetwork: 'goerli', apiKey: 'f811f2257c4a4cceba5ab9044a1f03d2' }
  }
}

export const decodeTxMethod = (data) => {
  try {
    const iface = new ethers.utils.Interface(MetamaskABI)
    const decodedData = iface.parseTransaction({ data: data })

    switch (get(decodedData, 'name')) {
      case 'setApprovalForAll':
        return TRANSACTION_METHOD.SET_APPROVAL_FOR_ALL
      case 'mintCollectibles':
        return TRANSACTION_METHOD.MINT_COLLECTIBLES
      case 'approve':
        return TRANSACTION_METHOD.APPROVE
      default:
        return TRANSACTION_METHOD.TOKEN_TRANSFER
    }
  } catch (error) {
    console.error('decodeTxMethod - Error:', error.message)
    return TRANSACTION_METHOD.TOKEN_TRANSFER
  }
}
