import { ETH_NETWORK_PROVIDER, SOL_NETWORK_PROVIDER } from 'constants/koiConstants'

const isMatchEthereumChain = (wcChainId, providers) => {
  switch (providers) {
    case ETH_NETWORK_PROVIDER.GOERLI:
      return wcChainId === 'eip155:5'
    case ETH_NETWORK_PROVIDER.MAINNET:
      return wcChainId === 'eip155:1'

    default:
      return wcChainId === 'eip155:1'
  }
}

const isMatchSolanaChain = (wcChainId, providers) => {
  switch (providers) {
    case SOL_NETWORK_PROVIDER.DEVNET:
      return wcChainId === 'solana:8E9rvCKLFQia2Y35HXjjpWzj8weVo44K'
    case SOL_NETWORK_PROVIDER.MAINNET:
      return wcChainId === 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ'

    default:
      return wcChainId === 'solana:4sGjMW1sUnHzSxGspuhpqLDx6wiyjNtZ'
  }
}
export default { isMatchEthereumChain, isMatchSolanaChain }
