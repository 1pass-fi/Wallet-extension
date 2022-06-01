// Services
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { origin, confirm, address } = payload.data

    if (confirm) {
      const siteAddressDict = (await storage.setting.get.siteAddressDictionary()) || {}
      siteAddressDict[origin] = address
      await storage.setting.set.siteAddressDictionary(siteAddressDict)

      chrome.action.setBadgeText({ text: '' })
      next({ data: 'Connected', status: 200 })
    } else {
      chrome.action.setBadgeText({ text: '' })
      next({ data: 'User cancalled the login.', status: 403 })
    }
  } catch (err) {
    console.error(err.message)
    next({ error: 'Connect error' })
  }
}
