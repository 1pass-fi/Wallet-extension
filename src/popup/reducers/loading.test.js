import * as types from 'actions/types'

import loadingReducer from './loading'

const initialState = false

describe('Loading reducer', () => {
  describe('Initial', () => {
    it('has false state', () => {
      expect(loadingReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_CONT_LOADING', () => {
    it('sets true state', () => {
      const isLoading = true
      expect(loadingReducer(isLoading, { type: types.SET_LOADING, payload: isLoading }))
        .toEqual(isLoading)
    })
  })
})
