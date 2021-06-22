import { LOAD_KOI_BY, PATH, STORAGE, ERROR_MESSAGE } from 'koiConstants'
import passworder from 'browser-passworder'
import moment from 'moment'
import { get, isNumber, isArray } from 'lodash'

import Arweave from 'arweave'
import axios from 'axios'

import { koi } from 'background'

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
    console.log({ myContent })
    const storage = await getChromeStorage(STORAGE.CONTENT_LIST)
    const contentList = storage[STORAGE.CONTENT_LIST] || []
    if (myContent.length === contentList.length) return
    return Promise.all(myContent.map(async contentId => {
      try {
        console.log(`${PATH.SINGLE_CONTENT}${contentId}`)
        const { data: content } = await axios.get(`${PATH.SINGLE_CONTENT}${contentId}`)
        console.log({ content })
        if (content.title) {
          let url = `${PATH.NFT_IMAGE}/${content.txIdContent}`
          if (content.fileLocation) url = content.fileLocation
          const u8 = Buffer.from((await axios.get(url, { responseType: 'arraybuffer'})).data, 'binary').toString('base64')
          let imageUrl = `data:image/jpeg;base64,${u8}`
          if (content.contentType.includes('video')) imageUrl = `data:video/mp4;base64,${u8}`
          return {
            name: content.title,
            isKoiWallet: content.ticker === 'KOINFT',
            earnedKoi: content.totalReward,
            txId: content.txIdContent,
            imageUrl,
            galleryUrl: `${PATH.GALLERY}?id=${content.txIdContent}`,
            koiRockUrl: `${PATH.KOI_ROCK}/${content.txIdContent}`,
            isRegistered: true,
            contentType: content.contentType,
            totalViews: content.totalViews,
            createdAt: content.createdAt
          }
        } else {
          return {
            name: '...',
            isKoiWallet: true,
            earnedKoi: content.totalReward,
            txId: content.txIdContent,
            imageUrl: 'https://koi.rocks/static/media/item-temp.49349b1b.jpg',
            galleryUrl: `${PATH.GALLERY}?id=${content.txIdContent}`,
            koiRockUrl: `${PATH.KOI_ROCK}${content.txIdContent}`,
            isRegistered: true,
            contentType: content.contentType || 'image',
            totalViews: content.totalViews,
            createdAt: content.createdAt
          }
        }
      } catch (err) {
        console.log(err.message)
        return {
          isRegistered: false,
          isKoiWallet: false
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
    console.log(await koiObj.getOwnedTxs(koiObj.address))
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
          activityName = `Minted NFT "${initState.title}"`
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
      tx = await arweave.createTransaction({ target: transaction.target, quantity: transaction.quantity })
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

export const numberFormat = (num) => {
  return num === null ? '---' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num)
}

export const fiatCurrencyFormat = (num) => {
  return num === null ? '---' : new Intl.NumberFormat('en-US', { maximumFractionDigits: 4 }).format(num)
}

export const transactionAmountFormat = (num) => {
  return num === null ? '---' : `${Math.round(num * Math.pow(10, 6)) / Math.pow(10, 6)}`
}

export const getAccountName = async ()  => {
  const name = (await getChromeStorage(STORAGE.ACCOUNT_NAME))[STORAGE.ACCOUNT_NAME]
  return name
}

export const updateAccountName = async (name) => {
  await setChromeStorage({ [STORAGE.ACCOUNT_NAME] : name})
  return name
}

async function getDataBlob(imageUrl) {

  var res = await fetch(imageUrl)
  var blob = await res.blob()
  var obj = {}
  obj.contentType = blob.type

  // var uri = await parseURI(blob);
  console.log(blob)
  var buffer = await blob.arrayBuffer()
  obj.data = buffer
  console.log(buffer)

  return obj
}

export const exportNFT = async (arweave, ownerAddress, content, imageUrl = '', imageBlob, wallet = {}, imageObj) => {
  try {
    const bundlerUrl = 'https://bundler.openkoi.com:8888'
    console.log('arweave',arweave)
    let nftData
    let imgContentBuffer
    let imgContentType
    if (imageUrl) {
      console.log({ imageUrl })
      nftData = await getDataBlob(imageUrl)
      imgContentBuffer = nftData.data
      imgContentType = nftData.contentType
    } else {
      console.log({ imageBlob })
      nftData = imageBlob
      imgContentBuffer = nftData.data

      imgContentType = nftData.type
    }

    console.log('image buffer blob : ', nftData)
    console.log('image type : ', imgContentType)

    let metadata = {
      // owner: 'l2Fe-SdzRD-fPvlkrxlrnu0IC3uQlVeXIkHWde8Z0Qg', // This is Al's test wallet for Koi server
      owner: ownerAddress, // my test wallet
      name: 'koi nft',
      description: 'first koi nft',
      ticker: 'KOINFT'
    }
    metadata.title = content.title
    metadata.name = content.owner
    metadata.owner = ownerAddress
    metadata.description = content.description
    metadata.ticker = 'KOINFT'

    const balances = {}
    balances[metadata.owner] = 1

    let d = new Date()
    let createdAt = Math.floor(d.getTime()/1000).toString()
    const initialState = {
      'owner': metadata.owner,
      'title': metadata.title,
      'name': metadata.name,
      'description': metadata.description,
      'ticker': metadata.ticker,
      'balances': balances,
      'contentType': imgContentType,
      'createdAt': createdAt
    }
    if (wallet === {}) {
      wallet = { 'kty': 'RSA', 'e': 'AQAB', 'n': 'pyK_z1Jmluzr775_gwQgkRVhq5LbZ8RDpqwyV6CYIufphPMOSemd60BceRdrM-KmKExLpakWLOs6zBj6mcUgMhwqKuS_as8R1IqX6VFwEj4oW2VyPO4oKdgz9HVP3BSwiHSznc1O6DkTtaqQnHHP_61AGMMMfJsubuOEMS-VJwF9yyAeuwtdiryYpe_Y0nOvfySSe7OUzncdRsfEznSyBEpSCUB-vRpHe-6E7USGo9vu1DyTv1Svw5Ly5VqsRNeAWF2uKdKEf4muUiyPLnijgqzzQ0N-q2GDAPJi-xjHpDwjxBSPPVpLn2IB8-YQSE3SmeTzTi6nitkzcPwpQxbmYb40K7V3xyQGoq_QBSbvOdYy5epMco1GeCq5AFeQB5k5C-a9e66Hc4GhBjArycc-DXStokZ7_c7F95dtC0ynLW6rGipp1PDLAEOXwD-0sxnvh43MvinIUjQL4MICYDdP15GNVqoqNTs7gZU7oP15OgTEem-4Uf3WkvJcS6uRGZPmDtF3eKOIMXLytf-QSECU9WE7qoWEd8TdO17Gns688LGKpJwuPGZ7bwGqU5iteBWQMKcoArPJdTCQCT_T7fOE6COO4oEYoHp7WRtM3HUO2MUTbM7rb4h9InZ5OPZ600jYWmMYnFhO_tquR5_-GmtL7m7KmPrfCOGB2XI42baWdwM', 'd': 'FdYl7l3rNmvU9ZlTipgW8y2yeZqx3NBZMGUOHMHILsNTEMI6yzBhKBPcIRwMrxY9NEWnmojJc2v2XiUjVMTbDID-h2Uklz1frH_BEkRIGrIRTsOl1c0d5T2wqA9NtEjluaZZs1PYK-INL66Nv0rlbJfDqJiPQJZ7zhQeuNhpKdP5jfjv2utEuPQkE4YPM4vW0YtDMjNHzWPlqNI_5eN8QLA_IKNTC7zruwbySheqaa05-nPBr_1OC4TfBFVA7aukQqdWsnMlSY6A_o6A1IcBgfi7vb2LRrPyTETe5sSZjN0opR00i8UI3VWOQMH9vZyhV-cAXOYekLcJEAl6EKBk0AkaucrU4D5GIW8vrvdQlGQEkFIOQzzjri73-DOu0MZAEFl0H5nv6NKYHuZVuTm12f8ordBaeIoxNvgu0AbfbmT-W-YUhlA2iXT4-J2TuyGmXCJoa-uyG_uwWCWC72JIOGsojudHgOhrQ8Jnrjq5pBQXAtbG0MqgTaY-MSQtQLyH4GbMcyzQi08vuBfCFigItqgSKJXANoXe1L-PpVsXVEd2j6lfpzbw4DMjHgqURxgLePJTrQJ3KrKCO-DdJ1SsJiDosKhRu_XmbLrKX6dARWt9XZ89E9DZonJWqCp1C6zsIxuWT9A89fOqzYqePY5zNfDOWkiYkaOkRvvJ28aoPEk', 'p': '5Hg3zT9CRxcOvjLyuTtkvqL4fbFEqYta9oKJu3vhB21IMi8GsZv5oUpXvB6shqYFNOpRLNpuRiUDw0dlbIWP_6HPB5pNGHnoOqB8YdGPHNx7jwdEvrGJULxETaViNoQpAP3ZdD2sV-KAdlOp-tWz9T5-BeIKf8MsOPNZHL3kwRsL_rRbffXqV_uWs8MA0_0xObOlYHFJCaC7FHXjwtj--T05-IxlKaA2zyya0TnqheVipHlyEEzpS7KNyFltQDXhZY5nKnN4RFn_JeMFzH7I2zlaTcZV97p-FQkcksSMgPseauaU57G-Wmjpwo2wy5ANxnij5ZikgC67d1TWN3MBqw', 'q': 'u0aEap1zpwEEXXORu8OoOjrnJGKxij_MYr5-Rh86pNh_elx3WRwB5XPr9FbLrZlXbuBsUjRFvbRlad3qta174C1PAnLV7lN3NuQc6JC8aUKH8Yo40hI0ezJvkTomQQcoV5Ny3vBmoKP3wfSjNaX3WfswAiloeLTPsa-k8nZvn7ljZyZBesneeJbnGpWvw5HH7ZCkFZQ2m2Jz7kcyG33VBjS3nPDMWiN2n5vPAJOZJuNqnwdhnr4QCX32UFs1d8C70QmJ8XlkrP4Rb2Diw2nJsNAwDiq75dYFn8G_KirYFcS_PnzSR7Sze_VDocysCUe2gEc4qywLjCfhkc36H4o4CQ', 'dp': 'seWB3clB_ETR7_uPz_eVTHNtdcGQK0wdOhEO2fNtlvDa5GiFl8pRp-tRQWPJBtdC-p7xMjGq5-dudKGlMckWBQCjSdI18bcKwouwDiK0gs6TTx1jw_BNcZYGwUbjoHtryh_fMInNJmlxibE_i9bW10Efs8j8T9tTFc02OBEMi-hZgKxDCWNwY628_J_8hxSBPeLKBLxxGJQU16ur-04nyz6HYyc-phjgVJTwv7WPDU89bcA6tsKMbarMh5JKZVMO_JrTbdSXcvF4oLGTFFYsY7bWv_SNf-WwwwRjQUzV8qCWYLrGe1qFU7SZQCo_3WF_uGi7hc1DWaQJyLNAUdC1HQ', 'dq': 'Gt9XiOTm_4PJ2I8IzmSY8yIYoMP4rdnRvimPfQhmJdlbEXfLOGIoc4Baz0jVGSfzv9k8Md-GUl5cXwCU-VTXfaeCuts3j2cyqBG7hDOglYoSb7phxOMP3M2z7KbnblVUmJxz00GzuEFO_-nWsZALGkJM9UJz1z46v0hw5snP4p97gAWhR7lHzw34Q3xPKET250PmB6Ko40sRT5OvwPohYy6VWlPDPvvvvZ9h6LdFNqtTVVZ9z4V-T55fhdBQr8pcKPaxcJD2vUwHvG-umlPHuTNmceH37Fb1n6Lxh192ekktGA5ZLijjyFm9Rq5T0VEVAvs1SnqbfZULbRydU4FF4Q', 'qi': 'L4qZnvGtcr-OAPuWyJb8vJ-UBwhIVO7FtwG3cMwTpUX1OM0AVb3UajoEyuwwJoZkbC4Hn3go-sg01gB9FsERGhxTLP3R6tCy6X1qlvURbvG2JQtYI6UmtHV_NIf0MIsUrYeG2n6-lpiadz6-tXaJ3W6e8tBC-XNuPF2VVQ4TTGOV28bNoqF0s_mzG4_ZlJcmgTm4H5i0n178vqGWP8Z9MbEGJngBGopOpnTDumGr-ZHZglB7_abyWSCZZSA_3YD4JnZ9feja00DK4rGuWcYZJVxCi7R0PF0KtmMSHCf6ygJXYxBs1adbYDD71L7wbZdcAhLgeslWvO_3ZVOWJvFhbw' }
    } else {
      console.log('current wallet')
      console.log({wallet})
    }
    let tx

    try {
      tx = await arweave.createTransaction({
        // eslint-disable-next-line no-undef
        data: imgContentBuffer
        // data: JSON.stringify(metadata)
      }, wallet)
    } catch (err) {
      console.log('create transaction error')
      console.log('err-transaction', err)
      return false
    }

    tx.addTag('Content-Type', imgContentType)
    tx.addTag('Network', 'Koi')
    tx.addTag('Action', 'marketplace/Create')
    tx.addTag('App-Name', 'SmartWeaveContract')
    tx.addTag('App-Version', '0.3.0')
    tx.addTag('Contract-Src', 'I8xgq3361qpR8_DvqcGpkCYAUTMktyAgvkm6kGhJzEQ')
    tx.addTag('Init-State', JSON.stringify(initialState))

    try {
      await arweave.transactions.sign(tx, wallet)
    } catch (err) {
      console.log('transaction sign error')
      console.log('err-sign', err)
      return false
    }
    console.log(tx)
    // console.log(" wallet : ", wallet);

    let uploader = await arweave.transactions.getUploader(tx)
    console.log('uploder', uploader)
    
    while (!uploader.isComplete) {
      await uploader.uploadChunk()
      console.log(
        uploader.pctComplete + '% complete',
        uploader.uploadedChunks + '/' + uploader.totalChunks
      )
    }

    /**/
    // pay via KOI
    try{
      let ktools = koi
      let resAddress = await ktools.loadWallet(wallet)
      console.log({resAddress})
      initialState.tx=tx
      initialState.registerDataParams={id:tx.id, ownerAddress}
      const formData  = new FormData()
      formData.append('file', imageObj)
      formData.append('data', JSON.stringify(initialState))
      const rawResponse = await fetch(`${bundlerUrl}/handleNFTUpload`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        body: formData
      })
      const response = await rawResponse.json()
      let resTx = await ktools.registerData(tx.id, ownerAddress, wallet, arweave)
      console.log({resTx})
    }catch(err){
      console.log('err-@_koi/sdk', err)
      return false
    }
    // end koi

    console.log(tx.id)
    return tx.id
  } catch (err) {
    console.log('err-last', err)
    return false
  }
}

export const utils = {
  loadWallet,
  setChromeStorage,
  getChromeStorage,
  removeChromeStorage
}
