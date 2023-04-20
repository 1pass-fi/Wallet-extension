import { ethers } from 'ethers'
import CustomError from 'utils/customError'

import { isNetworkPayload } from '../validateNetworkInput'

export const initEthereumNetworkProvider = async (networkPayload) => {
  try {
    if (!isNetworkPayload(networkPayload)) throw new Error('Invalid network payload')
    const provider = new ethers.providers.JsonRpcProvider(
      networkPayload.rpcUrl,
      { chainId: networkPayload.chainId }
    )

    try {
      await provider.getNetwork()
    } catch (err) {
      return false
    }

    return provider
  } catch (err) {
    throw new CustomError(err.message, ['initEthereumNetworkProvider'])
  }
}
