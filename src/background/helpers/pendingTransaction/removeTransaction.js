import { isEmpty } from 'lodash'

import errorHandler from '../errorHandler'

import { BackgroundAccount } from 'services/account/Account'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'

const removeTransaction = async (account, transaction) => {
  if (!(account instanceof BackgroundAccount)) throw new Error('Invalid input account')
  if (isEmpty(transaction)) throw new Error('Invalid input transaction')

  let allPendingTransactions = await account.get.pendingTransactions()
  allPendingTransactions = allPendingTransactions.filter(_transaction => {
    return _transaction.id !== transaction.id
  })

  if (transaction.transactionType === PENDING_TRANSACTION_TYPE.MINT_NFT ||
    transaction.transactionType === PENDING_TRANSACTION_TYPE.SEND_NFT) {
    let allAssets = await account.get.assets()
    
    if (transaction.transactionType === PENDING_TRANSACTION_TYPE.MINT_NFT) {
      allAssets = allAssets.filter(asset => asset.txId !== transaction.id)
    } else {
      allAssets = allAssets.map(asset => {
        if (asset.txId === transaction.contract) asset.isSending = false
        return asset
      })
    }

    await account.set.assets(allAssets)
  }

  await account.set.pendingTransactions(allPendingTransactions)
}

export default errorHandler(removeTransaction)
