import errorHandler from 'background/helpers/errorHandler'
import { get } from 'lodash'

import collections from '../../collections'

const resendCreateCollection = async (account, transaction) => {
  const collectionData = get(transaction, 'data.collectionData')

  return await collections.createCollection(collectionData, account)
}

export default errorHandler(resendCreateCollection)
