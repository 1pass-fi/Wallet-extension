import { act, renderHook } from '@testing-library/react-hooks'
import get from 'lodash/get'
import { popupAccount } from 'services/account'
import mockedAccounts from 'services/account/__fixtures__/allAccountMetadata.json'

import useAccountList from './useAccountList'

jest.mock('services/account')

const renderCustomHook = async (hook) => {
  let result
  await act(async () => {
    result = renderHook(() => hook()).result
  })

  return result
}

describe('useAccountList hook', () => {
  describe('get correct accountList data type', () => {
    let result
    beforeEach(async (done) => {
      result = await renderCustomHook(useAccountList)
      done()
    })

    it('should return correct accountList state', () => {
      const accountList = result.current.accountList

      let expectedAccountList = mockedAccounts.map((account, index) => ({
        id: index,
        value: get(account, 'address'),
        label: get(account, 'accountName'),
        address: get(account, 'address'),
        type: get(account, 'type')
      }))

      expect(accountList).toEqual(expectedAccountList)
    })
  })

  describe('fail to getAllMetadata', () => {
    let result
    beforeEach(async (done) => {
      popupAccount.getAllMetadata = jest.fn().mockImplementation(() => {
        throw new Error('Fail to getAllMetadata')
      })
      result = await renderCustomHook(useAccountList)
      done()
    })

    it('should return default state', () => {
      const accountList = result.current.accountList
      expect(accountList).toEqual([])
    })
  })

  describe('get wrong data type from getAllMetadata', () => {
    let result
    beforeEach(async (done) => {
      popupAccount.getAllMetadata = jest.fn().mockImplementation(() => '[account1, account2]')
      result = await renderCustomHook(useAccountList)
      done()
    })

    it('should return default state', () => {
      const accountList = result.current.accountList
      expect(accountList).toEqual([])
    })
  })
})
