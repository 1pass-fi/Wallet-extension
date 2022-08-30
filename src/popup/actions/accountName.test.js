import { SET_ACCOUNT_NAME } from 'actions/types'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { setAccountName } from './accountName'

describe('tests warning action', () => {
  it('dispatches as expected', () => {
    const mockStore = configureMockStore([thunk])
    const store = mockStore()

    const expectedActions = [
      { type: SET_ACCOUNT_NAME, payload: 'My Name' }
    ]
    store.dispatch(setAccountName('My Name'))
    expect(store.getActions()).toEqual(expectedActions)
  })
})
