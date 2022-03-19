import { isEmpty, isArray, get } from 'lodash'

import storage from 'services/storage'


export default async (_, tab, next) => {
  try {
    const { hadPermission, activatedAddress, origin } = tab

    if (hadPermission) {
      const siteConnectedAddresses = (await storage.setting.get.siteConnectedAddresses())[origin]
      if (isEmpty(siteConnectedAddresses)) return next()

      let connectedArweaveAddresses = get(siteConnectedAddresses, 'arweave', [])
      connectedArweaveAddresses = connectedArweaveAddresses.filter(address => address !== activatedAddress)

      siteConnectedAddresses.arweave = connectedArweaveAddresses
      await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)
    }

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Disconnect error' })
  }
}
