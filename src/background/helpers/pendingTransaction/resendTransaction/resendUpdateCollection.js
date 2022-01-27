import { get } from 'lodash'

import errorHandler from 'background/helpers/errorHandler'
import collections from '../../collections'

const resendUpdateCollection = async (account, transaction) => {
  const collectionData = get(transaction, 'data.collectionData')

  return await collections.updateCollection(collectionData, account)
}

export default errorHandler(resendUpdateCollection)

