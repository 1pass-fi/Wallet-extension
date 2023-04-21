import { PREDEFINED_EVM_NETWORK_METADATA } from 'constants/koiConstants'
import get from 'lodash/get'
import storage from 'services/storage'
import asyncPipe from 'utils/asyncPipe'
import CustomError from 'utils/customError'

import { getDataFromCustomNetworks } from './getDataFromCustomNetworks'
import { getDataFromPredefinedNetworks } from './getDataFromPredefinedNetworks'

export class GetNetworkMetadataError extends CustomError {
  constructor(message, prefixes = []) {
    super(message, ['GetNetworkMetadata Error', ...prefixes])
    this.name = 'GetNetworkMetadataError'
  }
}

export const getEthNetworkMetadata = async (key) => {
  const predefinedNetworks = PREDEFINED_EVM_NETWORK_METADATA
  const getter = () => storage.setting.get.customEvmNetworks()
  const validate = async (metadata) => {
    if (!get(metadata, 'networkName')) return false
    return metadata
  }

  try {
    return await asyncPipe([
      getDataFromPredefinedNetworks(predefinedNetworks),
      await getDataFromCustomNetworks(getter),
      validate
    ])(key)
  } catch (err) {
    throw new GetNetworkMetadataError(err?.message)
  }
}
