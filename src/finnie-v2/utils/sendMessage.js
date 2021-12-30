import { store } from 'react-notifications-component'

const SUCCESS = 'success'
const DANGER = 'danger'

const sendMessage = (type) => ({ title, message }) => {
  store.addNotification({
    title,
    message,
    type,
    insert: 'top',
    container: 'top-right',
    animationIn: ['animate__animated', 'animate__fadeIn'],
    animationOut: ['animate__animated', 'animate__fadeOut'],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  })
}

export default {
  success: sendMessage(SUCCESS),
  danger: sendMessage(DANGER)
}
