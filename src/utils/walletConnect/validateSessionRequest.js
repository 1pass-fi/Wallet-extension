import {  NETWORK, WC_ETH_CHAIN_ID, WC_SOL_CHAIN_ID } from 'constants/koiConstants'
import storage from 'services/storage'
import fromProviderToWCChain from 'utils/walletConnect/fromProviderToWCChain'

const validateSessionRequest = async (params) => {
  try {
    const { chainId } = params
    let wcChainId

    if (Object.values(WC_ETH_CHAIN_ID).includes(chainId)) {
      const currentProvider = await storage.setting.get.ethereumProvider()
      wcChainId = fromProviderToWCChain(currentProvider, NETWORK.ETHEREUM)
    }

    if (Object.values(WC_SOL_CHAIN_ID).includes(chainId)) {
      const currentProvider = await storage.setting.get.solanaProvider()
      wcChainId = fromProviderToWCChain(currentProvider, NETWORK.SOLANA)
    }

    if (wcChainId !== chainId) {
      return { error: { code: 4001, message: 'No matching chain' } }
    }

    return null
  } catch (error) {
    console.log('Failed to validate session request: ', error)
  }
}

export default validateSessionRequest
