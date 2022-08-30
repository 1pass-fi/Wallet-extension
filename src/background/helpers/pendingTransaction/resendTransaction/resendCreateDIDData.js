import did from 'background/helpers/did'
import koiiMe from 'background/helpers/did/koiiMe'
import { PENDING_TRANSACTION_TYPE } from 'constants/koiConstants'
import { get } from 'lodash'

import errorHandler from '../../errorHandler'

const resendCreateDIDData = async (account, transaction) => {
  const didData = get(transaction, 'data.didData')
  const kID = get(transaction, 'data.didData.kID')
  if (!didData) throw new Error('DID Data not found.')
  if (!brandlyId) throw new Error('Brandly ID not found.')

  const [id, contractId] = await did.createDID(didData, account)

  // map koiime to new react app
  await koiiMe.updateKoiiMe(didData?.kID, id, account)

  // update the pending create DID if any
  let pendingTransactions = await account.get.pendingTransactions()
  pendingTransactions = pendingTransactions.map(transaction => {
    if (transaction.transactionType === PENDING_TRANSACTION_TYPE.CREATE_DID) {
      transaction.id = id
      transaction.expired = false
      transaction.retried++
    }

    return transaction
  })

  await account.set.pendingTransactions(pendingTransactions)

  return contractId
}

export default errorHandler(resendCreateDIDData)
