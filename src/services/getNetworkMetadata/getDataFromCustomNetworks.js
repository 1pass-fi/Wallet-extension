import { get, isString } from 'lodash'
import CustomError from 'utils/customError'

export const getDataFromCustomNetworks = async (getter) => {
  let customNetworks
  try {
    customNetworks = (await getter()) || {}
  } catch (err) {
    console.error(err)
  }

  if (!customNetworks) customNetworks = {}

  return async (keyOrMetadata) => {
    try {
      if (!isString(keyOrMetadata)) {
        const networkMetadata = keyOrMetadata
        if (get(networkMetadata, 'networkName')) return networkMetadata
        throw new Error('Invalid key')
      }

      const key = keyOrMetadata
      const result = get(customNetworks, key)
      return result || key
    } catch (err) {
      throw new CustomError(err.message, ['getDataFromCustomNetworks'])
    }
  }
}
