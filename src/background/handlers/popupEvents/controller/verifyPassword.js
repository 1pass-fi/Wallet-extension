import { isEmpty } from 'lodash'
import passworder from 'browser-passworder'

import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { password } = payload.data

    const totalAccount = backgroundAccount.count()

    if (totalAccount === 0) {
      next({ data: false })
    } else {
      let accountAddress = await storage.setting.get.activatedArweaveAccountAddress()
      if (isEmpty(accountAddress)) {
        accountAddress = await storage.setting.get.activatedEthereumAccountAddress()
      }

      const encryptedKey = await backgroundAccount.getEncryptedKey(accountAddress)
      try {
        await passworder.decrypt(password, encryptedKey)
        next({ data: true })
      } catch (err) {
        next({ data: false })
      }
    }
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
