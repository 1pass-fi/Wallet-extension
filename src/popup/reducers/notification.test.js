import notificationReducer from './notification'
import * as types from 'actions/types'

const initialState = null

describe('Notification reducer', () => {
  describe('Initial', () => {
    it('has null state', () => {
      expect(notificationReducer(undefined, {})).toEqual(initialState)
    })
  })

  describe('Handle SET_ERROR', () => {
    it('sets true state', () => {
      const notification = 'notification message'
      expect(notificationReducer(notification, { type: types.SET_NOTIFICATION, payload: notification }))
        .toEqual(notification)
    })
  })
})
