import cache from 'background/cache'
import helpers from 'background/helpers'
import passworder from 'browser-passworder'
// Constants
import { TYPE } from 'constants/accountConstants'
import { isEmpty } from 'lodash'
import { backgroundAccount } from 'services/account'
// Services
import storage from 'services/storage'
// Utils
import { getProviderUrlFromName } from 'utils'
import { setActivatedAccountAddress } from 'utils'

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
        activatedAccountAddress = await storage.setting.get.activatedK2AccountAddress()
      }
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

    const newAccountName = await backgroundAccount.getNewAccountName()
    await account.set.accountName(newAccountName)

    // Set network provider
    const networkProvider = getProviderUrlFromName(provider)
    if (networkProvider) await account.set.provider(networkProvider)

    // If total account = 1, set this account to activatedAccountAddress.
    const totalAccounts = await backgroundAccount.count()
    if (totalAccounts == 1) {
      await storage.setting.set.activatedChain(type)
    }

    const totalArweaveAccounts = await backgroundAccount.count(TYPE.ARWEAVE)
    const totalEthereumAccounts = await backgroundAccount.count(TYPE.ETHEREUM)
    const totalSolanaAccounts = await backgroundAccount.count(TYPE.SOLANA)
    const totalK2Accounts = await backgroundAccount.count(TYPE.K2)

    if (totalArweaveAccounts == 1 && type === TYPE.ARWEAVE) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalEthereumAccounts == 1 && type === TYPE.ETHEREUM) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalSolanaAccounts === 1 && type === TYPE.SOLANA) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalK2Accounts === 1 && type === TYPE.K2) {
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
