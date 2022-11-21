import { WC_ETH_CHAIN_ID, WC_SOL_CHAIN_ID } from 'constants/koiConstants'

const validateEthereumChain = (chains) => {
  for (let chain of chains) {
    if (!Object.values(WC_ETH_CHAIN_ID).includes(chain)) return false
  }
  return true
}

const validateSolanaChain = (chains) => {
  for (let chain of chains) {
    if (!Object.values(WC_SOL_CHAIN_ID).includes(chain)) return false
  }
  return true
}

const validateSupportedChain = (requiredNamespaces) => {
  let isEthereumChains = true,
    isSolanaChains = true
  for (let typeChain in requiredNamespaces) {
    if (typeChain !== 'eip155' && typeChain !== 'solana') return false

    const chains = requiredNamespaces[typeChain].chains
    if (typeChain === 'eip155') isEthereumChains = validateEthereumChain(chains)
    if (typeChain === 'solana') isSolanaChains = validateSolanaChain(chains)
  }

  return isEthereumChains && isSolanaChains
}

export default validateSupportedChain
