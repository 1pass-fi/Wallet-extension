import errorReducer from './error'
import * as types from 'actions/types'

const initialState = null

describe('Error reducer', () => {
  describe('Initial', () => {
    it('has null state', () => {
      expect(errorReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_ERROR', () => {
    it('sets true state', () => {
      const error = 'error message'
      expect(errorReducer(error, { type: types.SET_ERROR, payload: error }))
      .toEqual(error)
    })
  })
})
