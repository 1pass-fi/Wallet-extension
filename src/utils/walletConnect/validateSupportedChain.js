import { WC_CHAIN_ID } from 'constants/koiConstants'

const validateEthereumChain = (chains) => {
  for (let chain of chains) {
    if (!WC_CHAIN_ID.ETHEREUM.includes(chain)) return false
  }
  return true
}

const validateSolanaChain = (chains) => {
  for (let chain of chains) {
    if (!WC_CHAIN_ID.SOLANA.includes(chain)) return false
  }
  return true
}

const validateSupportedChain = (requiredNamespaces) => {
  let isEthereumChains = true,
    isSolanaChains = true
  console.log('requiredNamespaces', requiredNamespaces)
  for (let typeChain in requiredNamespaces) {
    if (typeChain !== 'eip155' && typeChain !== 'solana') return false

    const chains = requiredNamespaces[typeChain].chains
    if (typeChain === 'eip155') isEthereumChains = validateEthereumChain(chains)
    if (typeChain === 'solana') isSolanaChains = validateSolanaChain(chains)
  }

  return isEthereumChains && isSolanaChains
}

export default validateSupportedChain
