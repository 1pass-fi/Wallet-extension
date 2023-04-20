import { extractEthereumNetworkPayload } from './extractEthereumNetworkPayload'

describe('extractEthereumNetworkPayload', () => {
  describe('with input is rpc url', () => {
    describe('valid rpc url', () => {
      it('returns correct network payload', async () => {
        const input = 'https://rpc-mumbai.maticvigil.com/'
        const expectedOutput = {
          rpcUrl: 'https://rpc-mumbai.maticvigil.com/',
          chainId: 80001
        }

        const result = await extractEthereumNetworkPayload(input)
        expect(result).toEqual(expectedOutput)
      })
    })

    describe('invalid rpc url', () => {
      it('throws an error', async () => {
        const input = 'invalid input'
        const expectedErrorMessage = '[extractEthereumNetworkPayload]: Invalid input'

        await expect(extractEthereumNetworkPayload(input)).rejects.toThrow(expectedErrorMessage)
      })
    })
  })

  describe('with input is network payload', () => {
    describe('valid network payload', () => {
      it ('returns the network payload directly', async () => {
        const input = { rpcUrl: 'https://google.com', chainId: 100 }
        const expectedOutput = {...input}

        const result = await extractEthereumNetworkPayload(input)
        expect(result).toEqual(expectedOutput)
      })
    })

    describe('invalid network payload', () => {
      it ('throws an error', async () => {
        const input = { rpcUrl: 'https://abc.com' }
        const expectedErrorMessage = '[extractEthereumNetworkPayload]: Invalid input'

        await expect(extractEthereumNetworkPayload(input)).rejects.toThrow(expectedErrorMessage)
      })
    })

    describe('invalid network payload', () => {
      it('throws an error', async () => {
        const input = 1
        const expectedErrorMessage = '[extractEthereumNetworkPayload]: Invalid input'

        await expect(extractEthereumNetworkPayload(input)).rejects.toThrow(expectedErrorMessage)
      })
    })
  })
})
