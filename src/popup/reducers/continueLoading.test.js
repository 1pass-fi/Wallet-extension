import continueLoadingReducer from './continueLoading'
import * as types from 'actions/types'

const initialState = false

describe('ContinueLoading reducer', () => {
  describe('Initial', () => {
    it('has false state', () => {
      expect(continueLoadingReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_CONT_LOADING', () => {
    it('sets true state', () => {
      const isContLoading = true
      expect(continueLoadingReducer(isContLoading, { type: types.SET_CONT_LOADING, payload: isContLoading }))
        .toEqual(isContLoading)
    })
  })
})
