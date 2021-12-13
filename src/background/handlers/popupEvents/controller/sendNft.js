// Services
import { backgroundAccount } from 'services/account'

// Constants
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'

import helpers from 'background/helpers'


export default async (payload, next) => {
  const { nftId, senderAddress, recipientAddress } = payload.data
  try {
    const credentials = await backgroundAccount.getCredentialByAddress(senderAddress)
    const account = await backgroundAccount.getAccount(credentials)

    const txId = await account.method.transferNFT(nftId, recipientAddress)

    const payload = {
      id: txId,
      activityName: 'Sent NFT',
      expense: 0.000001,
      target: recipientAddress,
      address: senderAddress,
      network: null,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.SEND_NFT,
      contract: nftId
    }
    await helpers.pendingTransactionFactory.createPendingTransaction(payload)

    // update isSending for nft
    let allAssets = await account.get.assets()
    allAssets = allAssets.map(asset => {
      if (asset.txId === nftId) asset.isSending = true
      return asset
    })

    await account.set.assets(allAssets)
    next({ data: txId })
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}
