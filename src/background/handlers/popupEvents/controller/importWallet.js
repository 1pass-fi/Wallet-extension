import { get, isString, isEmpty } from 'lodash'
import passworder from 'browser-passworder'

// Services
import storage from 'services/storage'
import { ArweaveAccount, EthereumAccount } from 'services/account/Account'
import { backgroundAccount } from 'services/account'
import { koiTools as koi } from 'services/arweave'
import eth from 'services/ethereum'

// Constants
import { TYPE } from 'constants/accountConstants'
import { ERROR_MESSAGE } from 'constants/koiConstants'

// Utils
import { getProviderUrlFromName } from 'utils'
import { setActivatedAccountAddress } from 'utils'

// helpers
import helpers from 'background/helpers'


export default async (payload, next) => {
  try {
    /* 
      Get data from popup message
    */
    let { key: keyOrSeedphrase, password, type, provider } = payload.data
    let address, walletKey, seedphrase
  
    let account
  
    /* 
      Determine if have seedphrase
    */
    if (type === TYPE.ARWEAVE) {
      if (isString(keyOrSeedphrase)) seedphrase = keyOrSeedphrase
    }
    if (type === TYPE.ETHEREUM) {
      if (isString(keyOrSeedphrase)) {
        const totalWords = keyOrSeedphrase.split(' ')
        if (totalWords.length === 12) seedphrase = keyOrSeedphrase
      }
    }
  
    /* 
      Password validation
      - If no imported account -> skip
    */
    const count = await backgroundAccount.count()
    if (count) {
      let activatedAccountAddress = await storage.setting.get.activatedArweaveAccountAddress()
      if (isEmpty(activatedAccountAddress)) {
        activatedAccountAddress = await storage.setting.get.activatedEthereumAccountAddress()
      }
      const encryptedKey = await backgroundAccount.getEncryptedKey(activatedAccountAddress)
      try {
        await passworder.decrypt(password, encryptedKey)
      } catch (err) {
        next({ error: err.message })
        return
      }
    }
  
    /* 
      Create new account on storage
    */
    switch(type) {
      case TYPE.ARWEAVE:
        address = await ArweaveAccount.utils.loadWallet(koi, keyOrSeedphrase)
        walletKey = koi.wallet
        break
      case TYPE.ETHEREUM:
        address = await EthereumAccount.utils.loadWallet(eth, keyOrSeedphrase)
        walletKey = eth.key
        break
    }
  
    // if account existed -> send error
    const accountExist = !backgroundAccount.importedAccount.every(credentials => {
      return credentials.address !== address
    })
  
    if (accountExist) {
      next({ error: ERROR_MESSAGE.ACCOUNT_EXIST })  
      return
    }
  
    await backgroundAccount.createAccount(address, walletKey, password, type)
            
    account = await backgroundAccount.getAccount({ address, key: walletKey })
  
    /* 
      Set seedPhrase field if any
    */
    if (seedphrase) {
      const encryptedPhrase = await passworder.encrypt(password, seedphrase)
      await account.set.seedPhrase(encryptedPhrase)
    }
  
    /* 
      Set the provider if any (ethereum wallet will habe)
    */
    const providerUrl = getProviderUrlFromName(provider)
    if (provider) await account.set.provider(providerUrl)
    
  
    /* 
      Get a default name for this account
    */
    const totalAccounts = await backgroundAccount.count()
    await account.set.accountName(`Account#${totalAccounts}`)
  
    /* 
      If total account = 1, set this accountAddress to activatedAccountAddress
    */
    const totalArweaveAccounts = await backgroundAccount.count(TYPE.ARWEAVE)
    const totalEthereumAccounts = await backgroundAccount.count(TYPE.ETHEREUM)
    if (totalArweaveAccounts == 1 && type === TYPE.ARWEAVE) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalEthereumAccounts == 1 && type === TYPE.ETHEREUM) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }
           
    /* 
      Get balance for this account
    */
    helpers.loadBalances()
  
    helpers.loadActivities()

    next({ data: address })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })    
  }
}
