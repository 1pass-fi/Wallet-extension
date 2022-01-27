import { Web } from '@_koi/sdk/web'
import axios from 'axios'

import arweave from 'services/arweave'
import { popupBackgroundRequest as request } from 'services/request/popup'

import nftInfoSchema from './nftInfoSchema'
import { getChromeStorage, setChromeStorage } from '../'

import { PENDING_TRANSACTION_TYPE, PATH } from 'constants/koiConstants'
import { ACCOUNT, TYPE } from 'constants/accountConstants'

/*
  Return nft ids of uploaded nfts
*/
export default async ({nfts, setNfts, address, collectionData, selectedNftIds}) => {
  console.log('collectionData', collectionData)

  nfts = [...nfts]
  const key = await request.gallery.getKey({address})

  let info = nftInfoSchema.validate(nfts.info)
  if (info.error) throw new Error(info.error.message)

  info = info.value

  let nftIds = await Promise.all(nfts.map(async ({ info, url }, index) => {
    try {
      console.log('info', info)
      console.log('url', url)

      const buffer = await getBufferFromUrl(url)
      const transaction = await createTransaction(buffer, info)
      let price = await arweave.transactions.getPrice(buffer.byteLength)
      price = arweave.ar.winstonToAr(price)
      const fileType = info.contentType
  
      await arweave.transactions.sign(transaction, key)
      const uploader = await arweave.transactions.getUploader(transaction)
      while (!uploader.isComplete) {
        await uploader.uploadChunk()
      }
      // await mockUploadNft()
  
      const koii = new Web()
      koii.wallet = key
      await koii.getWalletAddress()
      await registerData(koii, transaction.id)
  
      setNfts(prev => {prev[index].uploaded = true; return [...prev]})
  
      // save pending transaction
      const pendingTransaction = {
        id: transaction.id,
        activityName: `Minted NFT "${info.title}"`,
        expense: price,
        retried: 1,
        timestamp: Date.now(),
        transactionType: PENDING_TRANSACTION_TYPE.MINT_NFT,
        address
      }
      console.log('pendingTransaction', pendingTransaction)
      await addPendingTransaction(address, pendingTransaction)
  
      // save pending asset
      const base64String = Buffer.from((await axios.get(url, { responseType: 'arraybuffer' })).data, 'binary').toString('base64')
      let imageUrl = `data:image/jpeg;base64,${base64String}`
      if (fileType.includes('video')) imageUrl = `data:video/mp4;base64,${base64String}`
      const pendingNFT = {
        name: info.title,
        owner: info.ownerName,
        description: info.description,
        isNSFW: info.isNSFW,
        tags: info.tags,
        isKoiWallet: true,
        earnedKoi: 0,
        txId: transaction.id,
        imageUrl,
        galleryUrl: `${PATH.GALLERY}#/details/${transaction.id}`,
        koiRockUrl: `${PATH.KOI_ROCK}/${transaction.id}`,
        isRegistered: true,
        contentType: fileType,
        totalViews: 0,
        createdAt: info.createdAt,
        pending: true,
        type: TYPE.ARWEAVE,
        expired: false,
        retried: 1
      }
      await addPendingTransaction(address, pendingNFT, true)
  
      return transaction.id
    } catch (err) {
      console.error(err.message)
    }
  }))

  nftIds = [...nftIds, ...selectedNftIds]

  // create collection
  collectionData.collection = nftIds

  console.log('collectionData', collectionData)
  const txId = await request.gallery.createNewCollection({ collectionData, address })
  // const txId = 'collectionId'

  // await mockUploadNft()
  return txId
}

const getBufferFromUrl = async (url) => {
  const response = await fetch(url)
  const blob = await response.blob()
  return blob.arrayBuffer()
}

const createTransaction = async (buffer, info) => {
  const { isNSFW, ownerName, ownerAddress, title, description, tags, contentType, createdAt } = info

  try {
    const balances = { [ownerAddress]: 1 }
    const ticker = 'KOINFT'

    const initialState = {
      'owner': ownerAddress,
      'title': title,
      'name': ownerName,
      'description': description,
      'ticker': ticker,
      'balances': balances,
      'contentType': contentType,
      'createdAt': createdAt,
      'tags': tags,
      'locked': []
    }

    const transaction = await arweave.createTransaction({ data: buffer })
    addTag({ transaction, contentType, initialState, isNSFW })

    return transaction
  } catch (err) {
    throw new Error(err.message)
  }
}

const addTag = ({ transaction, contentType, initialState, isNSFW }) => {
  transaction.addTag('Content-Type', contentType)
  transaction.addTag('Network', 'Koii')
  transaction.addTag('Action', 'marketplace/Create')
  transaction.addTag('App-Name', 'SmartWeaveContract')
  transaction.addTag('App-Version', '0.3.0')
  transaction.addTag('Contract-Src', 'r_ibeOTHJW8McJvivPJjHxjMwkYfAKRjs-LjAeaBcLc')
  transaction.addTag('Init-State', JSON.stringify(initialState))
  transaction.addTag('NSFW', isNSFW)
}

const registerData = async (koii, txId) => {
  await koii.burnKoiAttention(txId)
  await koii.migrateAttention()
}

const addPendingTransaction = async (address, transaction, isAsset) => {
  try {
    if (!isAsset) {
      const account = (await getChromeStorage(address))[address]
      if (!account[ACCOUNT.PENDING_TRANSACTION]) account[ACCOUNT.PENDING_TRANSACTION] = []
      if (!isAsset) account[ACCOUNT.PENDING_TRANSACTION].push(transaction)
      console.log('account', account)
      await setChromeStorage({ [address]: account })
    } else {
      let pendingAssets = (await getChromeStorage(`${address}_pendingAssets`))[`${address}_pendingAssets`]
      if (!pendingAssets) pendingAssets = []
      pendingAssets.push(transaction)
      await setChromeStorage({ [`${address}_pendingAssets`]: pendingAssets })
    }
  } catch (err) {
    console.error(err.message)
  }
}

const mockUploadNft = () => {
  const time = (2 + Math.floor(Math.random() * 5)) * 1000

  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

