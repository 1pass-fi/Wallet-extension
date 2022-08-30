import did from 'background/helpers/did'
import errorHandler from 'background/helpers/errorHandler'
import { get } from 'lodash'

const resendUpdateDID = async (account, transaction) => {
  const didData = get(transaction, 'data.didData')
  const txId = get(transaction, 'data.didTransactionID')

  if (!didData || !txId) throw new Error('Invalid transaction input')

  return await did.updateDID(didData, txId, account)
}

export default errorHandler(resendUpdateDID)
