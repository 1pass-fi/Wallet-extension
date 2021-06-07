import activitiesReducer from './activities'
import * as types from 'actions/types'

const initialState = []

describe('Activities reducer', () => {
  describe('Initial', () => {
    it('has empty array state', () => {
      expect(activitiesReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_ACTIVITIES', () => {
    it('adds new activities list', () => {
      const activities = [1, 2 , 3]
      expect(activitiesReducer([], { type: types.SET_ACTIVITIES, payload: activities }))
        .toEqual(activities)
    })
  })

  describe('Handle CLEAR_ACTIVITIES', () => {
    it('returns empty array', () => {
      expect(activitiesReducer([1, 2, 3], { type: types.CLEAR_ACTIVITIES }))
        .toEqual([])
    })
  })
})
