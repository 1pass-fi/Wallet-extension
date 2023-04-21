import { get, isString } from 'lodash'
import CustomError from 'utils/customError'

export const getDataFromPredefinedNetworks = (predefinedNetworks) => async (keyOrMetadata) => {
  try {
    if (!isString(keyOrMetadata)) {
      let networkMetadata = keyOrMetadata
      if (get(networkMetadata, 'networkName')) return networkMetadata
      throw new Error('Invalid key')
    }

    const key = keyOrMetadata
    const result = get(predefinedNetworks, key)
    return result || key
  } catch (err) {
    throw new CustomError(err.message, ['getPredefinedNetwork'])
  }
}
