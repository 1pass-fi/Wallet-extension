import { get, isEmpty } from 'lodash'
import storage from 'services/storage'

export default async (_, tab, next) => {
  try {
    const { hadPermission, connectedAddresses, origin } = tab

    if (hadPermission) {
      let siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()
      if (isEmpty(siteConnectedAddresses[origin])) return next()

      let connectedK2Addresses = get(siteConnectedAddresses[origin], 'k2', [])
      connectedK2Addresses = connectedK2Addresses.filter((address) => address !== connectedAddresses[0])

      siteConnectedAddresses[origin].k2 = connectedK2Addresses

      await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)
    }

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Disconnect error' })
  }
}
