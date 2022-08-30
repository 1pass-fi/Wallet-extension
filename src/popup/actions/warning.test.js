import { CLEAR_ERROR, CLEAR_NOTIFICATION, CLEAR_WARNING, SET_WARNING } from 'actions/types'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { setWarning } from './warning'

describe('tests warning action', () => {
  it('dispatches as expected', async () => {
    const mockStore = configureMockStore([thunk])
    const store = mockStore()

    const expectedActions = [
      { type: CLEAR_ERROR },
      { type: CLEAR_NOTIFICATION },
      { type: CLEAR_WARNING },
      { type: SET_WARNING, payload: 'warning' }
    ]
    await store.dispatch(setWarning('warning'))
    expect(store.getActions()).toEqual(expectedActions)
  })
})
