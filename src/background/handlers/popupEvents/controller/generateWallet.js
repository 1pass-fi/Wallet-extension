import { Web } from '@_koi/sdk/web'

// Constants
import { TYPE } from 'constants/accountConstants'
// Services
import { ArweaveAccount, EthereumAccount, K2Account,SolanaAccount } from 'services/account/Account'
import { EthereumTool } from 'services/ethereum'
import { K2Tool } from 'services/k2'
import { SolanaTool } from 'services/solana'

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
        break

      case TYPE.K2:
        walletTool = new K2Tool()
        seedPhrase = await K2Account.utils.generateWallet(walletTool)
        key = walletTool.key
        address = walletTool.address
        walletTool.wallet = key
        break
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
