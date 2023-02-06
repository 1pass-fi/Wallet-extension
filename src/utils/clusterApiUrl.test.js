import clusterApiUrl from './clusterApiUrl'

const ENDPOINT = {
  http: {
    devnet: 'http://api.devnet.solana.com',
    testnet: 'http://api.testnet.solana.com',
    'mainnet-beta': 'http://solana-mainnet.g.alchemy.com/v2/Ofyia5hQc-c-yfWwI4C9Qa0UcJ5lewDy'
  },
  https: {
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://api.testnet.solana.com',
    'mainnet-beta': 'https://solana-mainnet.g.alchemy.com/v2/Ofyia5hQc-c-yfWwI4C9Qa0UcJ5lewDy'
  }
}

describe('clusterApiUrl function', () => {
  it('should correctly return URL when passing cluster and tls', () => {
    const url = clusterApiUrl('mainnet-beta', true)
    expect(url).toBe(ENDPOINT.https['mainnet-beta'])
  })

  it('should correctly return URL when cluster parameter is undefined', () => {
    const url = clusterApiUrl(undefined, false)
    expect(url).toBe(ENDPOINT.http['devnet'])
  })

  it('should correctly return URL when cluster parameter is null', () => {
    const url = clusterApiUrl(null, true)
    expect(url).toBe(ENDPOINT.https['devnet'])
  })

  it('should correctly return URL when tls parameter is missing', () => {
    const url = clusterApiUrl('testnet')
    expect(url).toBe(ENDPOINT.https['testnet'])
  })

  it('should return correctly URL when missing all the parameter', () => {
    const url = clusterApiUrl()
    expect(url).toBe(ENDPOINT.https['devnet'])
  })

  it('should throw error when the URL cannot be found', () => {
    expect(() => clusterApiUrl('mainnet', true)).toThrow(`Unknown https cluster: mainnet`)
  })
})
