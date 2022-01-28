import { get } from 'lodash'
import passworder from 'browser-passworder'

import { IMPORTED } from 'constants/accountConstants'

import { ChromeStorage } from 'services/storage/ChromeStorage'
import { backgroundAccount } from 'services/account'

export default async (payload, next) => {
  try {
    const { oldPassword, newPassword } = payload.data

    if (!oldPassword || !newPassword) {
      next({ error: 'Invalid input' })
      return
    }

    const chromeStorage = new ChromeStorage()
    let importedArweave = await chromeStorage._getChrome(IMPORTED.ARWEAVE) || []
    let importedEthereum = (await chromeStorage._getChrome(IMPORTED.ETHEREUM)) || []

    importedArweave = await Promise.all(importedArweave.map(async accountData => {
      const encryptedKey = get(accountData, 'encryptedKey')
      if (!encryptedKey) throw new Error('Encrypted key not found')

      const key = await passworder.decrypt(oldPassword, encryptedKey)
      const newEncryptedKey = await passworder.encrypt(newPassword, key)
      accountData['encryptedKey'] = newEncryptedKey

      return accountData
    }))

    importedEthereum = await Promise.all(importedEthereum.map(async accountData => {
      const encryptedKey = get(accountData, 'encryptedKey')
      if (!encryptedKey) throw new Error('Encrypted key not found')

      const key = await passworder.decrypt(oldPassword, encryptedKey)
      const newEncryptedKey = await passworder.encrypt(newPassword, key)
      accountData['encryptedKey'] = newEncryptedKey

      return accountData
    }))

    const allAccounts = await backgroundAccount.getAllAccounts()
    allAccounts.forEach(async account => {
      const encryptedSeedPhrase = await account.get.seedPhrase()
      const seedPhrase = await passworder.decrypt(oldPassword, encryptedSeedPhrase)
      const newEncryptedSeedPhrase = await passworder.encrypt(newPassword, seedPhrase)
      await account.set.seedPhrase(newEncryptedSeedPhrase)
    })

    await chromeStorage._setChrome(IMPORTED.ARWEAVE, importedArweave)
    await chromeStorage._setChrome(IMPORTED.ETHEREUM, importedEthereum)

    console.log('Password updated.')
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
