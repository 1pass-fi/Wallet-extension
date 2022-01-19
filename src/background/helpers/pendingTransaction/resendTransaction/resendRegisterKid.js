import { get } from 'lodash'

import did from 'background/helpers/did'
import errorHandler from 'background/helpers/errorHandler'

const resendRegisterKid = async (account, transaction) => {
  const kID = get(transaction, 'data.kID')
  const txId = get(transaction, 'data.txId')

  if (!kID || !txId) throw new Error('Invalid transaction input')
  
  return await did.koiiMe.mapKoiiMe({ txId, kID, account })
}

export default errorHandler(resendRegisterKid)
