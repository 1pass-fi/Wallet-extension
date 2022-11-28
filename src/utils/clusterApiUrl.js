const endpoint = {
  http: {
    devnet: 'http://api.devnet.solana.com',
    testnet: 'http://k2-testnet.koii.live',
    'mainnet-beta': 'http://solana-mainnet.g.alchemy.com/v2/Ofyia5hQc-c-yfWwI4C9Qa0UcJ5lewDy'
  },
  https: {
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://k2-testnet.koii.live',
    'mainnet-beta': 'https://solana-mainnet.g.alchemy.com/v2/Ofyia5hQc-c-yfWwI4C9Qa0UcJ5lewDy'
  }
}

/**
 * Retrieves the RPC API URL for the specified cluster
 */
export default function clusterApiUrl(cluster, tls) {
  const key = tls === false ? 'http' : 'https'

  if (!cluster) {
    return endpoint[key]['devnet']
  }

  const url = endpoint[key][cluster]

  if (!url) {
    throw new Error(`Unknown ${key} cluster: ${cluster}`)
  }

  return url
}
