// Services
import { backgroundAccount } from 'services/account'


export default async (payload, next) => {
  try {
    const { senderAddress, targetAddress, txId, numOfTransfers, tokenAddress, tokenSchema } = payload.data

    // get credentials of sender address
    const credentials = await backgroundAccount.getCredentialByAddress(senderAddress)
    const account = await backgroundAccount.getAccount(credentials)
    const typeOfWallet = await backgroundAccount.getType(targetAddress)
    const accountName = await account.get.accountName()

    const result = await account.method.nftBridge({ 
      txId, 
      toAddress: targetAddress, 
      typeOfWallet, 
      tokenAddress, 
      tokenSchema, 
      accountName
    })

    if (result) {
      next({ data: result })
    } else {
      next({ error: 'Bridge NFT failed' })
    }
  } catch (err) {
    console.error(err.message)
    next({ error: 'Bridge NFT error' })
  }
}
