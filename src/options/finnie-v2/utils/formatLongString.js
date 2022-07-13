import isString from 'lodash/isString'

const formatLongString = (inputStr, maxLength, isAddress = false) => {
  if (!isString(inputStr)) {
    return ''
  }

  const strLength = inputStr.length

  if (strLength <= maxLength) return inputStr

  let splitPoint1 = Math.floor(maxLength * 0.7)
  const splitPoint2 = isAddress ? strLength - 6 : strLength - Math.floor(maxLength * 0.3)

  if (isAddress) {
    const numUpperFirst = (inputStr.substring(0, splitPoint1).match(/[A-Z0]/g) || []).length
    const numUpperLast = (inputStr.substring(splitPoint2).match(/[A-Z0]/g) || []).length
    splitPoint1 = 16 - Math.floor((numUpperFirst + numUpperLast) / 2)
  }

  return `${inputStr.substring(0, splitPoint1)}...${inputStr.substring(splitPoint2)}`
}

export const formatLongStringTruncate = (inputStr, maxLength) => {
  const strLength = inputStr.length
  if (strLength <= maxLength) return inputStr
  return `${inputStr.substring(0, maxLength)}...`
}

export default formatLongString
