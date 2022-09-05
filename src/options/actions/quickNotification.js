import { CLEAR_QUICK_NOTIFICATION,SET_QUICK_NOTIFICATION } from './types'

export const setQuickNotification = (notification) => (dispatch) => {
  dispatch({
    type: CLEAR_QUICK_NOTIFICATION
  })

  dispatch({
    type: SET_QUICK_NOTIFICATION,
    payload: notification
  })
}

export const clearQuickNotification = (dispatch) => {
  dispatch({
    type: CLEAR_QUICK_NOTIFICATION
  })
}
