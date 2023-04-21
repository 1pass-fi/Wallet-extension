import { isNetworkPayload, isRpcUrl, validateNetworkInput } from './validateNetworkInput'

describe('isNetworkPayload', () => {
  it('returns true if network payload is valid', () => {
    const input = {
      rpcUrl: 'https://google.com',
      chainId: 100
    }

    const result = isNetworkPayload(input)
    expect(result).toBeTruthy()
  })

  it('returns false if network payload is invalid', () => {
    const input = 'invalid input'

    const result = isNetworkPayload(input)
    expect(result).toBeFalsy()
  })
})

describe('isRpcUrl', () => {
  it('returns true if rpc url is valid', () => {
    const input = 'https://google.com'

    const result = isRpcUrl(input)
    expect(result).toBeTruthy()
  })

  it('returns false if rpc url is invalid', () => {
    const input = 'not an url'

    const result = isRpcUrl(input)
    expect(result).toBeFalsy
  })
})

describe.skip('validateNetworkInput', () => {
  it('returns network payload if network payload is valid', async () => {
    const input = {
      rpcUrl: 'https://google.com',
      chainId: 100
    }
    const expectedResult = {...input}

    const result = await validateNetworkInput(input)
    expect(result).toEqual(expectedResult)
  })

  it('returns rpc url if rpc url is valid', async () => {
    const input = 'https://google.com'
    const expectedResult = input

    const result = await validateNetworkInput(input)
    expect(result).toBe(expectedResult)
  })

  it('throws an error if input is invalid', async () => {
    const input = 'invalid input'
    
    await expect(validateNetworkInput(input)).rejects.toThrow('[validateInputRpcUrl]: Invalid input')
  })
})
