import numeral from 'numeral'
import { isString } from 'lodash'
import { setChromeStorage } from 'utils'

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
