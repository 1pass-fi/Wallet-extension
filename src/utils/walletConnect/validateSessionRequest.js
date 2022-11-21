import {
  ETH_MESSAGE,
  ETH_NETWORK_PROVIDER,
  NETWORK,
  SOL_NETWORK_PROVIDER,
  WC_CHAIN_ID
} from 'constants/koiConstants'
import get from 'lodash/get'
import storage from 'services/storage'

const fromProviderToWCChain = (provider, network) => {
  if (network === NETWORK.ETHEREUM) {
    switch (provider) {
      case ETH_NETWORK_PROVIDER.GOERLI:
        return 'eip155:5'
      case ETH_NETWORK_PROVIDER.MAINNET:
        return 'eip155:1'
    }
  }

  if (network === NETWORK.SOLANA) {
    switch (provider) {
      case SOL_NETWORK_PROVIDER.DEVNET:
        return 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K'
      case SOL_NETWORK_PROVIDER.MAINNET:
        return 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ'
    }

    return undefined
  }
}

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

    if (WC_CHAIN_ID.ETHEREUM.includes(chainId)) {
      defaultAddress = await storage.setting.get.activatedEthereumAccountAddress()
      const currentProvider = await storage.setting.get.ethereumProvider()
      wcChainId = fromProviderToWCChain(currentProvider, NETWORK.ETHEREUM)
    }

    if (WC_CHAIN_ID.SOLANA.includes(chainId)) {
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

    return undefined
  } catch (error) {
    console.log('Failed to validate session request: ', error)
  }
}

export default validateSessionRequest
