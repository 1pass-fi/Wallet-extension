import { validateEthereumChainId } from './validateEthereumChainId'

describe('validateEthereumChainId', () => {
  describe('valid chainId', () => {
    it ('returns network payload', async () => {
      const input = {
        rpcUrl: 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
        chainId: 5
      }
      const expectedOutput = {...input}

      const result = await validateEthereumChainId(input)
      expect(result).toEqual(expectedOutput)
    })
  })

  describe('invalid chainId', () => {
    it('returns false', async () => {
      const input = {
        rpcUrl: 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2',
        chainId: 6
      }

      const result = await validateEthereumChainId(input)
      expect(result).toBeFalsy()
    })
  })
})
