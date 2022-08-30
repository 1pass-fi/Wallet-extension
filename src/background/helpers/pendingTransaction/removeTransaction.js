import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { isEmpty } from 'lodash'
import { BackgroundAccount } from 'services/account/Account'

import errorHandler from '../errorHandler'

const removeTransaction = async (account, transaction) => {
  if (!(account instanceof BackgroundAccount)) throw new Error('Invalid input account')
  if (isEmpty(transaction)) throw new Error('Invalid input transaction')

  let allPendingTransactions = await account.get.pendingTransactions()
  allPendingTransactions = allPendingTransactions.filter(_transaction => {
    return _transaction.id !== transaction.id
  })

  if (transaction.transactionType === PENDING_TRANSACTION_TYPE.MINT_NFT) {
    let pendingAssets = await account.get.pendingAssets()
    pendingAssets = pendingAssets.filter(asset => asset.txId !== transaction.id)

    await account.set.pendingAssets(pendingAssets)
  }

  if (transaction.transactionType === PENDING_TRANSACTION_TYPE.SEND_NFT) {
    let allAssets = await account.get.assets()
    allAssets = allAssets.map(asset => {
      if (asset.txId === transaction.contract) asset.isSending = false
      return asset
    })
    await account.set.assets(allAssets)

  }

  await account.set.pendingTransactions(allPendingTransactions)
}

export default errorHandler(removeTransaction)
