import get from 'lodash/get'
import isString from 'lodash/isString'
import CustomError from 'utils/customError'

export const isNetworkPayload = (payload) => get(payload, 'rpcUrl') && get(payload, 'chainId')
export const isRpcUrl = (url) => {
  if (!isString(url)) return false
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/
  return urlRegex.test(url)
}

export const validateNetworkInput = async (urlOrPayload) => {
  try {
    if (!isNetworkPayload(urlOrPayload) && !isRpcUrl(urlOrPayload)) throw new Error('Invalid input')
    return urlOrPayload
  } catch (err) {
    throw new CustomError(err.message, ['validateInputRpcUrl'])
  }
}
