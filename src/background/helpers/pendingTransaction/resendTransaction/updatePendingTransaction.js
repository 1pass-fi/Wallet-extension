import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'

export default async (account, transaction, newTxId) => {
  let pendingTransactions = await account.get.pendingTransactions()
  pendingTransactions = pendingTransactions.map(_transaction => {
    if (_transaction.id === transaction.id) {
      _transaction.id = newTxId
      _transaction.expired = false
      _transaction.retried++
    }
    return _transaction
  })

  if (transaction.transactionType === PENDING_TRANSACTION_TYPE.MINT_NFT) {
    let pendingAssets = await account.get.pendingAssets()
    pendingAssets = pendingAssets.map(asset => {
      if (asset.txId === transaction.id) asset.txId = newTxId
      return asset
    })

    await account.set.pendingTransactions(pendingAssets)
  }

  await account.set.pendingTransactions(pendingTransactions)
}
