import { isEmpty, get } from 'lodash'

import storage from 'services/storage'


export default async (_, tab, next) => {
  try {
    const { hadPermission, activatedAddress, origin } = tab

    if (hadPermission) {
      let siteConnectedAddresses = (await storage.setting.get.siteConnectedAddresses())
      if (isEmpty(siteConnectedAddresses[origin])) return next()

      let connectedArweaveAddresses = get(siteConnectedAddresses[origin], 'solana', [])
      connectedArweaveAddresses = connectedArweaveAddresses.filter(address => address !== activatedAddress)

      siteConnectedAddresses[origin].solana = connectedArweaveAddresses
      await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)
    }

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: 'Disconnect error' })
  }
}
