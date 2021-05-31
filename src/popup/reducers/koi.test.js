import koiReducer from './koi'
import * as types from 'actions/types'

const initialState = {
  arBalance: null,
  koiBalance: null,
  address: null
}

describe('Koi reducer', () => {
  describe('Initial', () => {
    it('has initial object state', () => {
      expect(koiReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_CREATE_WALLET', () => {
    it('adds new attributes', () => {
      const newAttr = {
        arBalance: 0,
        koiBalance: 0,
        address: 'address'
      }
      expect(koiReducer(newAttr, { type: types.SET_KOI, payload: newAttr }))
      .toEqual(newAttr)
    })
  })
})
