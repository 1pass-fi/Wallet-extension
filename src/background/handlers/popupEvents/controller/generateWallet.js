import { Web } from '@_koi/sdk/web'

// Services
import { ArweaveAccount, EthereumAccount, SolanaAccount } from 'services/account/Account'
import { EthereumTool } from 'services/ethereum'
import { SolanaTool } from 'services/solana'

// Constants
import { TYPE } from 'constants/accountConstants'

import cache from 'background/cache'

export default async (payload, next) => {
  try {
    const { walletType } = payload.data
    let walletTool
    let seedPhrase
    let key
    let address
    switch (walletType) {
      case TYPE.ARWEAVE:
        walletTool = new Web()
        seedPhrase = await ArweaveAccount.utils.generateWallet(walletTool)
        address = walletTool.address
        break
      case TYPE.ETHEREUM:
        walletTool = new EthereumTool()
        seedPhrase = await EthereumAccount.utils.generateWallet(walletTool)
        key = walletTool.key // key of eth wallet will be String
        address = walletTool.address
        walletTool.wallet = key
        break
      case TYPE.SOLANA:
        walletTool = new SolanaTool()
        seedPhrase = await SolanaAccount.utils.generateWallet(walletTool)
        key = walletTool.key
        address = walletTool.address
        walletTool.wallet = key
      // TODO DatH - LongP - add generate K2 account(s)
    }

    const generatedKey = cache.getGeneratedKey()
    generatedKey.key = walletTool.wallet
    generatedKey.mnemonic = seedPhrase
    generatedKey.type = walletType
    generatedKey.address = address
    cache.setGeneratedKey(generatedKey)

    next({ data: seedPhrase.split(' ') })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
