import { Web } from '@_koi/sdk/web'
import { MOCK_COLLECTIONS_STORE, STORAGE } from 'constants/koiConstants'
import { isString } from 'lodash'
import { find, get } from 'lodash'
import numeral from 'numeral'
import { getChromeStorage, setChromeStorage } from 'utils'

export const koi = new Web()

import storage from 'services/storage'

export const formatNumber = (value, decimal) => {
  const zeroArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  return numeral(value).format(
    decimal ? `0,0.${zeroArray.slice(0, decimal).join('')}` : '0,0.00'
  )
}

export const getDisplayAddress = (address, head = 6, tail = 4) => {
  try {
    if (isString(address)) return `${address.slice(0, head)}...${address.slice(address.length - tail)}`
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
  await storage.generic.set.nftBitData(u8)
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

export const JSONFileToObject = async (file) => {
  try {
    const fileText = await file.text()
    return JSON.parse(fileText)
  } catch (err) {
    throw new Error(err.message)
  }
}
