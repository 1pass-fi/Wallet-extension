import { get } from 'lodash'

import errorHandler from '../../errorHandler'
import did from 'background/helpers/did'

const resendCreateDIDData = async (account, transaction) => {
  const target = transaction?.source
  const qty = transaction?.expense
  if (!target || !qty) throw new Error('Invalid transaction input')

  const didData = get(transaction, 'data.didData')
  if (!didData) throw new Error('DID Data not found.')

  const [id, contractId] = await did.createDID(didData, account)

  return contractId
}

export default errorHandler(resendCreateDIDData)
