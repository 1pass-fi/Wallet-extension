import { ETH_RPC_URL_CHAINID_MAPPING } from 'constants/koiConstants'
import get from 'lodash/get'
import isNumber from 'lodash/isNumber'
import storage from 'services/storage'
import CustomError from 'utils/customError'

import { isNetworkPayload } from '../validateNetworkInput'
import { isRpcUrl } from '../validateNetworkInput'

export const extractEthereumNetworkPayload = async (networkPayloadOrRpcUrl) => {
  try {
    if (isNetworkPayload(networkPayloadOrRpcUrl)) return networkPayloadOrRpcUrl
    if (!isRpcUrl(networkPayloadOrRpcUrl)) throw new Error('Invalid input')


    const customEvmNetworks = await storage.setting.get.customEvmNetworks()
    
    let customEvmMapping = {}

    Object.keys(customEvmNetworks).forEach(rpcUrl => {
      customEvmMapping[rpcUrl] = Number(get(customEvmNetworks, [rpcUrl, 'chainId']))
    })


    const allMapping = {...ETH_RPC_URL_CHAINID_MAPPING, ...customEvmMapping}

    const rpcUrl = networkPayloadOrRpcUrl
    const chainId = get(allMapping, networkPayloadOrRpcUrl)
    if (!isNumber(chainId)) throw new Error('Unsupported network')

    return { rpcUrl, chainId }
  } catch (err) {
    throw new CustomError(err.message, ['extractEthereumNetworkPayload'])
  }
}
