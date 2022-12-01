import {
  ETH_NETWORK_PROVIDER,
  NETWORK,
  SOL_NETWORK_PROVIDER,
  WC_ETH_CHAIN_ID,
  WC_SOL_CHAIN_ID
} from 'constants/koiConstants'

const fromProviderToWCChain = (provider, network) => {
  if (network === NETWORK.ETHEREUM) {
    switch (provider) {
      case ETH_NETWORK_PROVIDER.GOERLI:
        return WC_ETH_CHAIN_ID.GOERLI
      case ETH_NETWORK_PROVIDER.MAINNET:
        return WC_ETH_CHAIN_ID.MAINNET
    }
  }

  if (network === NETWORK.SOLANA) {
    switch (provider) {
      case SOL_NETWORK_PROVIDER.DEVNET:
        return WC_SOL_CHAIN_ID.DEVNET
      case SOL_NETWORK_PROVIDER.MAINNET:
        return WC_SOL_CHAIN_ID.MAINNET
    }

    return undefined
  }
}

export default fromProviderToWCChain
