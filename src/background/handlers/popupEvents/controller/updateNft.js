import { isUndefined } from 'lodash'
import { smartweave } from 'smartweave'

import { backgroundAccount } from 'services/account'
import arweave from 'services/arweave'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import helpers from 'background/helpers'

export default async (payload, next) => {
  try {
    const { isPrivate, address, txId } = payload.data
    console.log('INPUT', { isPrivate, address, txId })
    if (!address) {
      next({ error: 'Address not found' })
      return
    }
    if (!txId) {
      next({ error: 'Transaction ID not found' })
    }
    const credential = await backgroundAccount.getCredentialByAddress(address)

    let transactionId
    if (!isUndefined(isPrivate)) {
      transactionId = 'test-transaction-id'
      // await smartweave.interactWrite(arweave, credential.key, txId, {
      //   function: 'setIsPrivate',
      //   isPrivate
      // })
    }

    // create pending transaction
    const pendingTransactionPayload = {
      id: transactionId,
      activityName: 'Updated NFT',
      expense: 0.00004,
      address,
      retried: 1,
      transactionType: PENDING_TRANSACTION_TYPE.UPDATE_NFT,
      data: { txId, isPrivate }
    }

    await helpers.pendingTransactionFactory.createPendingTransaction(pendingTransactionPayload)
    await sleep()
    next()
  } catch (err) {
    console.error(err.message)
    next({ error: err.message })
  }
}

const sleep = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 3000)
  })
}
