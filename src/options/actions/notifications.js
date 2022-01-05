import { ADD_NOTIFICATION, SET_NOTIFICATIONS } from './types'

export const setNotifications = (notifications) => (dispatch) => {
  dispatch({
    type: SET_NOTIFICATIONS,
    payload: notifications
  })
}

export const addNotification = (notification) => (dispatch) => {
  dispatch({
    type: ADD_NOTIFICATION,
    payload: notification
  })
}

export const viewNotifications = () => async (dispatch) => {
  dispatch({
    type: VIEW_NOTIFICATIONS
  })
}
