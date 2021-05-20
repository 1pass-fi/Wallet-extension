import { MESSAGES } from 'constants'

let pendingMessages = {}

export default async (koi, port, message) => {
  if (!message.type) return

  if (pendingMessages[message.type] === true) return
  pendingMessages[message.type] = true

  try {
    switch (message.type) {
      case MESSAGES.GET_ADDRESS: {
        if (koi.address) {
          port.postMessage({
            type: MESSAGES.GET_ADDRESS_SUCCESS,
            data: koi.address
          })
        } else {
          port.postMessage({
            type: MESSAGES.GET_ADDRESS_ERROR,
            data: 'Address not found'
          })
        }
        break
      }
      default:
        break
    }

  } catch (err) {
    port.postMessage({
      type: MESSAGES.ERROR,
      data: err.message
    })
  }

  pendingMessages[message.type] = undefined
}
