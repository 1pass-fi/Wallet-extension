import { act,renderHook } from '@testing-library/react-hooks'
import mockedAccounts from 'services/account/__fixtures__/accounts.json'

import useAccountList from './useAccountList'

jest.mock('services/account')

describe('useAccountList hook', () => {
  const result = act(() => {
    renderHook(() => useAccountList()).result.all
  })

  console.log('result', result)
  
  it('should return correct accountList state', () => {
    expect(result[1]).toBe(mockedAccounts)
  })
})
