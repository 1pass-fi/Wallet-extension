import numeral from 'numeral'
import { isString } from 'lodash'
import { getChromeStorage, setChromeStorage } from 'utils'
import { MOCK_COLLECTIONS_STORE, STORAGE } from 'koiConstants'
import { find, get } from 'lodash'
import { koi } from 'background'

export const formatNumber = (value, decimal) => {
  const zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  return numeral(value).format(
    decimal ? `0,0.${zeroArray.slice(0, decimal).join('')}` : '0,0.00'
  )
}

export const getDisplayAddress = (address) => {
  try {
    if (isString(address)) return `${address.slice(0, 6)}...${address.slice(address.length - 4)}`
  } catch (err) {
    throw new Error(err.message)
  }
}

/**
 * 
 * @param {File} file file object
 */
export const saveImageDataToStorage = async (file) => {
  const url = URL.createObjectURL(file)
  // console.log('bottomButton- file', file)

  // get arrayBuffer
  const response = await fetch(url)
  const blob = await response.blob()
  const dataBuffer = await blob.arrayBuffer()
  // console.log('bottomButton- dataBuffer', dataBuffer)

  // create a 8bit array and save to local storage
  let u8 = new Int8Array(dataBuffer)
  // console.log('bottomButton- u8', u8)

  // save u8 to local storage
  u8 = JSON.stringify(u8, null, 2)
  // console.log('bottomButton- u8', u8)

  await setChromeStorage({ NFT_BIT_DATA: u8 })
}

/**
 *
 * @param {Array} collection { tx: [id1, id2] } 
 */
export const mockSaveCollections = async (collection) => {
  console.log('new collection: ', collection)
  const storage = await getChromeStorage(MOCK_COLLECTIONS_STORE)
  const collections = storage[MOCK_COLLECTIONS_STORE] || []
  collections.push(collection)

  await setChromeStorage({[MOCK_COLLECTIONS_STORE]: collections})
}

export const mockGetCollections = async () => {
  const storage = await getChromeStorage(MOCK_COLLECTIONS_STORE)
  const collections = storage[MOCK_COLLECTIONS_STORE] || []
  return collections
}

export const getNftsDataForCollections = async (collection) => {
  const storageNfts = (await getChromeStorage(STORAGE.CONTENT_LIST))[STORAGE.CONTENT_LIST] || []

  const { collection: nftIds } = collection
  const nfts = nftIds.map(id => {
    const nft = find(storageNfts, v => v.txId == id)
    if (nft) return nft
  })

  const resultCollection = { ...collection, nfts }
  return resultCollection
}

export const stringTruncate = (str, length) => {
  try {
    if (str.length > 20) {
      return `${str.slice(0,length)}...`
    }
    return str
  } catch (err) {
    console.log(err)
  }
}

export const readState = async (txIds) => {
  const result = await Promise.all(txIds.map(async id => {
    try {
      let state = await koi.readState(id)
      const viewsAndReward = await koi.getViewsAndEarnedKOII(state.collection)
      state = {...state, id, ...viewsAndReward}
      console.log('state', state)
      return state
    } catch (err) {
      return null
    }
  }))
  return result.filter(collection => collection)
}

export const loadCollections = async (address) => {
  try {
    const savedCollection = (await getChromeStorage(STORAGE.COLLECTIONS))[STORAGE.COLLECTIONS] || []
    let fetchedCollections = await koi.getCollectionsByWalletAddress(address)

    if (savedCollection.length == fetchedCollections.length) return 'fetched'

    fetchedCollections = fetchedCollections.map(collection => get(collection, 'node.id'))
    console.log(fetchedCollections)
    fetchedCollections = await readState(fetchedCollections)
  
    fetchedCollections = await Promise.all(fetchedCollections.map(collection => getNftsDataForCollections(collection)))
    const allNftsLoadedSuccess = fetchedCollections.every(collection => {
      return collection.nfts.every(nft => nft)
    })
    console.log('fetchedCollections', fetchedCollections)
    console.log('allNftsLoadedSuccess', allNftsLoadedSuccess)

    allNftsLoadedSuccess && await setChromeStorage({[STORAGE.COLLECTIONS]: fetchedCollections})
    return fetchedCollections
  } catch (err) {
    console.log(err.message)
  }
}
