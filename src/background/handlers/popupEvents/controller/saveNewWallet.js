import passworder from 'browser-passworder'
import { isEmpty } from 'lodash'

// Services
import storage from 'services/storage'
import { backgroundAccount } from 'services/account'

// Constants
import { TYPE } from 'constants/accountConstants'

import helpers from 'background/helpers'

// Utils
import { getProviderUrlFromName } from 'utils'
import { setActivatedAccountAddress } from 'utils'

import cache from 'background/cache'

export default async (payload, next) => {
  try {
    let { password, provider } = payload.data
    const generatedKey = cache.getGeneratedKey()

    // Get key and seedphrase from koitool.
    const { key, mnemonic: seedPhrase, type } = generatedKey
    if (type === TYPE.ARWEAVE || type === TYPE.SOLANA) provider = null
    /* 
      Check for having imported account.
    */
    const count = await backgroundAccount.count()

    if (count) {
      let activatedAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
      if (isEmpty(activatedAccountAddress)) {
        activatedAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
      }
      if (isEmpty(activatedAccountAddress)) {
        activatedAccountAddress = await storage.setting.get.activatedSolanaAccountAddress()
      }

      const encryptedKey = await backgroundAccount.getEncryptedKey(activatedAccountAddress)

      // Check input password
      try {
        await passworder.decrypt(password, encryptedKey)
      } catch (err) {
        next({ error: err.message })
        return
      }
    }

    // get address from generatedKey object
    let addressFromKey = generatedKey.address

    const encryptedSeedPhrase = await passworder.encrypt(password, seedPhrase)

    // create new Account on background.
    await backgroundAccount.createAccount(addressFromKey, key, password, type)

    // get account object to set encrypted seedphrase
    const credentials = await backgroundAccount.getCredentialByAddress(addressFromKey)
    const account = await backgroundAccount.getAccount(credentials)
    account.set.seedPhrase(encryptedSeedPhrase)

    // Get total account to get a appropriate account name.
    const totalAccounts = await backgroundAccount.count()
    await account.set.accountName(`Account#${totalAccounts}`)
    console.log('totalAccounts', totalAccounts)
    // Set network provider
    const networkProvider = getProviderUrlFromName(provider)
    if (networkProvider) await account.set.provider(networkProvider)

    // If total account = 1, set this account to activatedAccountAddress.
    if (totalAccounts == 1) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    helpers.loadBalances()
    helpers.loadActivities()

    next({ data: addressFromKey })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
