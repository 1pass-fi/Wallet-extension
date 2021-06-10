import { SET_NOTIFICATION } from './types'

// export const setNotification = (payload) => ({ type: SET_NOTIFICATION, payload })
export const setNotification = (payload) => (dispatch) => {
  dispatch({ type: SET_NOTIFICATION, payload: null })
  setTimeout(() => {
    dispatch({ type: SET_NOTIFICATION, payload })
  }, 200)
}
