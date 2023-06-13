import { get } from 'lodash'

import { checkShouldOverwriteMetamask } from './inject'
import { getScriptPaths } from './inject'

jest.mock('services/storage', () => ({
  setting: {
    get: {
      overwriteMetamaskSites: jest.fn(() => ({
        'example.com': {
          shouldOverwriteMetamask: true,
        },
      })),
    },
  },
}))
jest.mock('lodash', () => ({
  get: jest.fn(),
}))

describe('checkShouldOverwriteMetamask', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return true if no alternatives are installed', async () => {
    const checkHasAlternativesInstalled = jest.fn().mockResolvedValueOnce(false)
    const result = await checkShouldOverwriteMetamask('example.com', checkHasAlternativesInstalled)

    expect(result).toBe(true)
  })

  it('should return the correct value from storage', async () => {
    const checkHasAlternativesInstalled = jest.fn().mockResolvedValueOnce(true)
    get.mockReturnValueOnce(true)

    const result = await checkShouldOverwriteMetamask('example.com', checkHasAlternativesInstalled)

    expect(result).toBe(true)
  })
})


describe('getScriptPaths', () => {
  it('should return the correct array of script paths if shouldOverwriteMetamask is true', async () => {
    const result = await getScriptPaths(true)

    expect(result).toEqual([
      '/scripts/arweave.js',
      '/scripts/solanaWeb3.js',
      '/scripts/declareConstantScript.js',
      '/scripts/eventEmitter.js',
      '/scripts/finnieRpcConnectionScript.js',
      '/scripts/finnieEthereumProviderScript.js',
      '/scripts/finnieArweaveProviderScript.js',
      '/scripts/finnieSolanaProviderScript.js',
      '/scripts/finnieKoiiWalletProviderScript.js',
      '/scripts/finnieK2ProviderScript.js',
      '/scripts/mainScript.js'
    ])
  })

  it('should return the correct array of script paths if shouldOverwriteMetamask is false', async () => {
    const result = await getScriptPaths(false)

    expect(result).toEqual([
      '/scripts/arweave.js',
      '/scripts/solanaWeb3.js',
      '/scripts/declareConstantScript.js',
      '/scripts/eventEmitter.js',
      '/scripts/finnieRpcConnectionScript.js',
      '/scripts/finnieKoiiWalletProviderScript.js',
      '/scripts/finnieK2ProviderScript.js',
      '/scripts/mainScript.js'
    ])
  })
})
