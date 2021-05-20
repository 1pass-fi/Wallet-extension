import { REQUEST } from 'constants'
import { MESSAGES } from 'constants'
import { checkSitePermission, setChromeStorage } from 'utils'

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
      case MESSAGES.GET_PERMISSION: {
        const { origin, favicon } = message.data
        console.log('ORIGIN', origin)
        console.log('FAVICON', favicon)
        console.log('CHECK SITE PERMISSION', await checkSitePermission(origin))
        if (!(await checkSitePermission(origin))) {
          setChromeStorage({
            'pendingRequest': {
              type: REQUEST.PERMISSION,
              data: { origin, favicon }
            }
          })
          chrome.windows.create({
            url: chrome.extension.getURL('/popup.html'),
            focused: true,
            type: 'popup',
            height: 622,
            width: 426
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
