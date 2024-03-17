// helpers
import helpers from 'background/helpers'
import passworder from 'browser-passworder'
// Constants
import { TYPE } from 'constants/accountConstants'
import { ETH_NETWORK_PROVIDER,POPUP_CONTROLLER_ERROR } from 'constants/koiConstants'
import { isEmpty, isString } from 'lodash'
import { backgroundAccount } from 'services/account'
import { ArweaveAccount, EthereumAccount, K2Account, SolanaAccount } from 'services/account/Account'
import { KoiTool } from 'services/arweave'
import { EthereumTool } from 'services/ethereum'
import { K2Tool } from 'services/k2'
import { SolanaTool } from 'services/solana'
// Services
import storage from 'services/storage'
// Utils
import { getProviderUrlFromName } from 'utils'
import { setActivatedAccountAddress } from 'utils'

export default async (payload, next) => {
  try {
    /* 
      Get data from popup message
    */
    let { key: keyOrSeedphrase, password, type, provider } = payload.data
    let address, walletKey, seedphrase, jsonKey

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
    if (type === TYPE.SOLANA) {
      seedphrase = keyOrSeedphrase
    }

    // TODO DatH - LongP
    if (type === TYPE.K2) {
      if (isString(keyOrSeedphrase)) seedphrase = keyOrSeedphrase
      else jsonKey = keyOrSeedphrase
    }

    /* 
      Password validation
      - If no imported account -> skip
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

    let eth = new EthereumTool(ETH_NETWORK_PROVIDER.MAINNET)
    let koi = new KoiTool()
    let sol = new SolanaTool()
    let k2 = new K2Tool()

    switch (type) {
      case TYPE.ARWEAVE:
        address = await ArweaveAccount.utils.loadWallet(koi, keyOrSeedphrase)
        walletKey = koi.wallet
        break
      case TYPE.ETHEREUM:
        address = await EthereumAccount.utils.loadWallet(eth, keyOrSeedphrase)
        walletKey = eth.key
        break
      case TYPE.SOLANA:
        address = await SolanaAccount.utils.loadWallet(sol, keyOrSeedphrase)
        walletKey = sol.key
        break
      case TYPE.K2:
        if (seedphrase) {
          address = await K2Account.utils.loadWallet(k2, keyOrSeedphrase)
          walletKey = k2.key          
        }
        if (jsonKey) {
          console.log('running import json K2')
          const result = await K2Account.utils.loadWalletFromJson(jsonKey)
          walletKey = result.key
          address = result.address
        }
        break
    }

    // if account existed -> send error
    const accountExist = !backgroundAccount.importedAccount.every((credentials) => {
      return credentials.address !== address
    })

    if (accountExist) {
      next({ error: POPUP_CONTROLLER_ERROR.ACCOUNT_EXIST })
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
    const newAccountName = await backgroundAccount.getNewAccountName()
    await account.set.accountName(newAccountName)

    /* 
      If total account = 1, set this accountAddress to activatedAccountAddress
    */
    const totalAccounts = await backgroundAccount.count()
    if (totalAccounts == 1) {
      await storage.setting.set.activatedChain(type)
    }

    const totalArweaveAccounts = await backgroundAccount.count(TYPE.ARWEAVE)
    const totalEthereumAccounts = await backgroundAccount.count(TYPE.ETHEREUM)
    const totalSolanaAccounts = await backgroundAccount.count(TYPE.SOLANA)
    const totalK2Accounts = await backgroundAccount.count(TYPE.K2)

    if (totalArweaveAccounts === 1 && type === TYPE.ARWEAVE) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalEthereumAccounts === 1 && type === TYPE.ETHEREUM) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalSolanaAccounts === 1 && type === TYPE.SOLANA) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    if (totalK2Accounts === 1 && type === TYPE.K2) {
      await setActivatedAccountAddress(await account.get.address(), type)
    }

    /* 
      Get balance for this account
    */
    helpers.loadBalances(type)

    helpers.loadActivities(type)

    next({ data: address })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
