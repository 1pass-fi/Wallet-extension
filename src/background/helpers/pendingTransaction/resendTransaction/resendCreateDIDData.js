import { get } from 'lodash'

import errorHandler from '../../errorHandler'
import did from 'background/helpers/did'
import koiiMe from 'background/helpers/did/koiiMe'

const resendCreateDIDData = async (account, transaction) => {
  const didData = get(transaction, 'data.didData')
  const brandlyId = get(transaction, 'data.brandlyID')
  if (!didData) throw new Error('DID Data not found.')
  if (!brandlyId) throw new Error('Brandly ID not found.')

  const [id, contractId] = await did.createDID(didData, account)

  // map koiime to new react app
  await koiiMe.updateKoiiMe(brandlyId, id)

  return contractId
}

export default errorHandler(resendCreateDIDData)
