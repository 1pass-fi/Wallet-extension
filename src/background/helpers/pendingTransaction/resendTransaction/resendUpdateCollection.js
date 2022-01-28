import { get } from 'lodash'

import errorHandler from 'background/helpers/errorHandler'
import collections from '../../collections'

const resendUpdateCollection = async (account, transaction) => {
  const collectionData = get(transaction, 'data.collectionData')
  const collectionId = get(transaction, 'data.collectionId')

  if (!collectionData || !collectionId) throw new Error('Invalid input')

  return await collections.updateCollection(collectionData, collectionId, account)
}

export default errorHandler(resendUpdateCollection)

