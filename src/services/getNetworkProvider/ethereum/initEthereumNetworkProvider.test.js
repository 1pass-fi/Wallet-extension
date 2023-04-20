import { ethers } from 'ethers'

import { initEthereumNetworkProvider } from './initEthereumNetworkProvider'

describe('initEthereumNetworkProvider', () => {
  describe('valid network payload', () => {
    it('returns an instance or JsonRpcProvider', async () => {
      const input = {
        rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
        chainId: 80001
      }

      const provider = await initEthereumNetworkProvider(input)
      expect(provider instanceof ethers.providers.JsonRpcProvider)
    })
  })

  describe('invalid network payload', () => {
    describe('invalid chainId', () => {
      it ('returns false', async () => {
        const input = {
          rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
          chainId: 1
        }

        const result = await initEthereumNetworkProvider(input)
        expect(result).toBeFalsy()
      })
    })

    describe('payload with wrong type', () => {
      it('throws an error', async () => {
        const input = 1
        const expectedErrorMessage = '[initEthereumNetworkProvider]: Invalid network payload'

        await expect(initEthereumNetworkProvider(input)).rejects.toThrow(expectedErrorMessage)
      })
    })
  })
})
