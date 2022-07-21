// Services
import storage from 'services/storage'

import { setActivatedAccountAddress } from 'utils'
import { popupAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { address } = payload.data

    const account = await popupAccount.getAccount({
      address: address
    })
    const defaultAccount = await account.get.metadata()
    await setActivatedAccountAddress(defaultAccount.address, defaultAccount.type)

    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
