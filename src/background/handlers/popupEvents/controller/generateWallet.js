import { Web } from '@_koi/sdk/web'

// Services
import { ArweaveAccount, EthereumAccount } from 'services/account/Account'
import { Ethereum } from 'services/ethereum'

// Constants
import { TYPE } from 'constants/accountConstants'

import { generatedKey } from 'background'

export default async (payload, next) => {
  try {
    const { walletType } = payload.data
    let walletObj
    let seedPhrase
    let key
    let address
    switch (walletType) {
      case TYPE.ARWEAVE:
        walletObj = new Web()
        seedPhrase = await ArweaveAccount.utils.generateWallet(walletObj)
        address = walletObj.address
        break
      case TYPE.ETHEREUM:
        walletObj = new Ethereum()
        seedPhrase = await EthereumAccount.utils.generateWallet(walletObj)
        key = walletObj.key // key of eth wallet will be String
        address = walletObj.address
        walletObj.wallet = key
    }

    generatedKey.key = walletObj.wallet
    generatedKey.mnemonic = seedPhrase
    generatedKey.type = walletType
    generatedKey.address = address

    next({ data: seedPhrase.split(' ') })    
  } catch (err) {
    console.error(err.message)
    next({ error: 'Generate wallet error' })
  }
}
