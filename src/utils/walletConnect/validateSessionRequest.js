import { ETH_MESSAGE, NETWORK, WC_ETH_CHAIN_ID, WC_SOL_CHAIN_ID } from 'constants/koiConstants'
import get from 'lodash/get'
import storage from 'services/storage'
import fromProviderToWCChain from 'utils/walletConnect/fromProviderToWCChain'

const getAddressFromRequest = (request) => {
  const { method, params } = request
  switch (method) {
    case ETH_MESSAGE.PERSONAL_SIGN:
      return params[1]
    case ETH_MESSAGE.SIGN:
    case ETH_MESSAGE.SIGN_TYPED_DATA:
    case ETH_MESSAGE.SIGN_TYPED_DATA_V3:
    case ETH_MESSAGE.SIGN_TYPED_DATA_V4:
      return params[0]
    case ETH_MESSAGE.SEND_TRANSACTION:
    case ETH_MESSAGE.SIGN_TRANSACTION:
      return get(params[0], 'from')
  }
}

const validateSessionRequest = async (params) => {
  try {
    const { request, chainId } = params
    let defaultAddress, wcChainId

    if (Object.values(WC_ETH_CHAIN_ID).includes(chainId)) {
      defaultAddress = await storage.setting.get.activatedEthereumAccountAddress()
      const currentProvider = await storage.setting.get.ethereumProvider()
      wcChainId = fromProviderToWCChain(currentProvider, NETWORK.ETHEREUM)
    }

    if (Object.values(WC_SOL_CHAIN_ID).includes(chainId)) {
      defaultAddress = await storage.setting.get.activatedSolanaAccountAddress()
      const currentProvider = await storage.setting.get.solanaProvider()
      wcChainId = fromProviderToWCChain(currentProvider, NETWORK.SOLANA)
    }

    if (wcChainId !== chainId) {
      return { error: { code: 4001, message: 'No matching chain' } }
    }

    if (getAddressFromRequest(request) !== defaultAddress) {
      return { error: { code: 4001, message: 'No matching account address' } }
    }

    return null
  } catch (error) {
    console.log('Failed to validate session request: ', error)
  }
}

export default validateSessionRequest
