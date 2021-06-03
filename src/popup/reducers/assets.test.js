import assetsReducer from './assets'
import * as types from 'actions/types'

const initialState = []

describe('Assets reducer', () => {
  describe('Initial', () => {
    it('has empty array state', () => {
      expect(assetsReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_ASSETS', () => {
    it('adds new assets list', () => {
      const assets = [1, 2 , 3]
      expect(assetsReducer(assets, { type: types.SET_ASSETS, payload: assets }))
        .toEqual(assets)
    })
  })
})
