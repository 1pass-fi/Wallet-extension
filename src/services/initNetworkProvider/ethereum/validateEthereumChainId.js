import { ethers } from 'ethers'
import CustomError from 'utils/customError'

import { isNetworkPayload } from '../validateNetworkInput'

export const validateEthereumChainId = async (networkPayload) => {
  try {
    if (!isNetworkPayload(networkPayload)) return false
    const provider = new ethers.providers.JsonRpcProvider(
      networkPayload.rpcUrl, 
      networkPayload.chainId
    )
    try {
      await provider.getNetwork()
      return networkPayload
    } catch (err) {
      return false
    }
  } catch (err) {
    throw new CustomError(err.message, ['validateEthereumChainId'])
  }
}
