import { ETH_RPC_URL_CHAINID_MAPPING } from 'constants/koiConstants'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import CustomError from 'utils/customError'

import { isNetworkPayload } from '../validateNetworkInput'
import { isRpcUrl } from '../validateNetworkInput'

export const extractEthereumNetworkPayload = async (networkPayloadOrRpcUrl) => {
  try {
    if (isNetworkPayload(networkPayloadOrRpcUrl)) return networkPayloadOrRpcUrl
    if (!isRpcUrl(networkPayloadOrRpcUrl)) throw new Error('Invalid input')

    const rpcUrl = networkPayloadOrRpcUrl
    const chainId = get(ETH_RPC_URL_CHAINID_MAPPING, networkPayloadOrRpcUrl)
    if (!isNumber(chainId)) throw new Error('Unsupported network')

    return { rpcUrl, chainId }
  } catch (err) {
    throw new CustomError(err.message, ['extractEthereumNetworkPayload'])
  }
}
