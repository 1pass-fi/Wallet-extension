import passworder from 'browser-passworder'
import { isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
import storage from 'services/storage'

export default async (payload, next) => {
  try {
    const { password } = payload.data
    const totalAccount = backgroundAccount.count()

    if (totalAccount === 0) {
      next({ data: false })
    } else {
      let accountAddress = await storage.setting.get.activatedK2AccountAddress()
      if (isEmpty(accountAddress)) {
        accountAddress = await storage.setting.get.activatedEthereumAccountAddress()
      }
      if (isEmpty(accountAddress)) {
        accountAddress = await storage.setting.get.activatedSolanaAccountAddress()
      }
      if (isEmpty(accountAddress)) {
        accountAddress = await storage.setting.get.activatedArweaveAccountAddress()
      }

      const encryptedKey = await backgroundAccount.getEncryptedKey(accountAddress)
      try {
        await passworder.decrypt(password, encryptedKey)
        next({ data: true })
      } catch (err) {
        console.error(err.message)
        next({ data: false })
      }
    }
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
