import { backgroundAccount } from 'services/account'

import { TYPE } from 'constants/accountConstants'

// Services
import storage from 'services/storage'

export default async (payload, tab, next) => {
  try {
    const { hadPermission, activatedAddress, origin } = tab

    // const siteAddressDictionary = await storage.setting.get.siteAddressDictionary()

    // const allAccounts = await backgroundAccount.getAllAccounts(TYPE.ETHEREUM)

    // siteAddressDictionary[origin] = await allAccounts[1].get.address()

    // await storage.setting.set.siteAddressDictionary(siteAddressDictionary)

    if (hadPermission) {
      return next({ data: 'This site has been connected' })
    }

    const allAccounts = await backgroundAccount.getAllAccounts(TYPE.ETHEREUM)
    const address = await allAccounts[0].get.address()

    const siteConnectedAddresses = await storage.setting.get.siteConnectedAddresses()

    siteConnectedAddresses?.ethereum?.push(address)

    await storage.setting.set.siteConnectedAddresses(siteConnectedAddresses)

    next({ data: siteConnectedAddresses.ethereum })
  } catch (err) {
    next({ error: err.message })
  }
}
