import asyncPipe from 'utils/asyncPipe'
import CustomError from 'utils/customError'

import { extractEthereumNetworkPayload } from './ethereum/extractEthereumNetworkPayload'
import { initEthereumNetworkProvider } from './ethereum/initEthereumNetworkProvider'
import { validateEthereumChainId } from './ethereum/validateEthereumChainId'
import { validateNetworkInput } from './validateNetworkInput'


export class InitNetworkProviderError extends CustomError {
  constructor(message, prefixes = []) {
    super(message, ['InitNetworkProvider Error', ...prefixes])
    this.name = 'InitNetworkProviderError'
  }
}

export const getEthereumNetworkProvider = async (networkPayloadOrRpcUrl) => {
  try {
    return await asyncPipe([
      validateNetworkInput,
      extractEthereumNetworkPayload,
      validateEthereumChainId,
      initEthereumNetworkProvider
    ])(networkPayloadOrRpcUrl)
  } catch (err) {
    throw new InitNetworkProviderError(err?.message)
  }
}
