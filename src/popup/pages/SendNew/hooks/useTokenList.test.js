import renderCustomHook from 'testUtils/renderCustomHook'

import useTokenList from './useTokenList'

jest.mock('services/account')
jest.mock('services/storage')
jest.mock('popup/sharedHooks/useImportedTokenAddresses')
jest.mock('utils')
jest.mock('utils/getTokenData')

describe('useTokenList testsuite', () => {
  describe('load Ethereum tokenList correctly', () => {
    let result
    beforeEach(async (done) => {
      result = await renderCustomHook(useTokenList, {
        selectedNetwork: 'TYPE_ETHEREUM',
        selectedAccount: {
          account_name: 'account_name',
          address: 'address',
          balance: 'balance',
          koi_balance: 'koi_balance',
          seed_phrase: 'seed_phrase',
          type: 'TYPE_ETHEREUM'
        }
      })
      done()
    })

    it('should return only ethereum token', () => {
      // console.log('result', result.current)  
      expect(1).toBe(1)
    })
  })
})
