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

import cache from 'background/cache'

export default async (payload, next) => {
  try {
    const { origin, confirm, address } = payload.data
    const contentScriptPort = cache.getContentScriptPort()

    if (confirm) {
      const siteAddressDict = await storage.setting.get.siteAddressDictionary() || {}
      siteAddressDict[origin] = address
      await storage.setting.set.siteAddressDictionary(siteAddressDict)

      chrome.browserAction.setBadgeText({ text: '' })

      contentScriptPort.port.postMessage({
        type: MESSAGES.KOI_CONNECT_SUCCESS,
        data: { status: 200, data: 'Connected.' },
        id: contentScriptPort.id
      })
    } else {
      chrome.browserAction.setBadgeText({ text: '' })
      contentScriptPort.port.postMessage({
        type: MESSAGES.KOI_CONNECT_SUCCESS,
        data: { status: 401, data: 'Connection rejected.' },
        id: contentScriptPort.id
      })
      
      contentScriptPort.port.postMessage({
        type: MESSAGES.CONNECT_ERROR,
        data: 'User cancelled the login.',
        id: contentScriptPort.id
      })
    }

    removeChromeStorage(STORAGE.PENDING_REQUEST)
    contentScriptPort.port.postMessage({
      type: MESSAGES.CONNECT_SUCCESS,
      id: contentScriptPort.id
    })

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Connect error' })
  }
}
