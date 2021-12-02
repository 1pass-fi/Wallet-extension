// Services
import storage from 'services/storage'

// Constants
import { 
  MESSAGES, 
  PORTS, 
  STORAGE, 
} from 'constants/koiConstants'

// Utils
import { removeChromeStorage } from 'utils'

import { permissionId, ports } from 'background'


export default async (payload, next) => {
  try {
    const { origin, confirm, address } = payload.data

    if (confirm) {
      const siteAddressDict = await storage.setting.get.siteAddressDictionary() || {}
      siteAddressDict[origin] = address
      await storage.setting.set.siteAddressDictionary(siteAddressDict)

      chrome.browserAction.setBadgeText({ text: '' })
      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.KOI_CONNECT_SUCCESS,
        data: { status: 200, data: 'Connected.' },
        id: permissionId[permissionId.length - 1],
      })
    } else {
      chrome.browserAction.setBadgeText({ text: '' })
      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.KOI_CONNECT_SUCCESS,
        data: { status: 401, data: 'Connection rejected.' },
        id: permissionId[permissionId.length - 1],
      })
      ports[PORTS.CONTENT_SCRIPT].postMessage({
        type: MESSAGES.CONNECT_ERROR,
        data: 'User cancelled the login.',
        id: permissionId[permissionId.length - 1],
      })
    }

    removeChromeStorage(STORAGE.PENDING_REQUEST)
    ports[PORTS.CONTENT_SCRIPT].postMessage({
      type: MESSAGES.CONNECT_SUCCESS,
      id: permissionId[permissionId.length - 1],
    })

    next()

    permissionId.length = 0
  } catch (err) {
    console.error(err.message)
    next({ error: 'Connect error' })
  }
}
