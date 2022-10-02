import { get } from 'lodash'
import decodeTags  from 'utils/decodeTags'

import { TRANSACTION_TYPE } from './constants'

const getTransactionType = async (transactionPayload) => {
  try {
    const tags = decodeTags(get(transactionPayload, 'tags'))

    if (!tags) return TRANSACTION_TYPE.ORIGIN_TOKEN_TRANSFER
    const input = JSON.parse(get(tags, 'Input'))

    if (get(input, 'function') === 'transfer') return TRANSACTION_TYPE.CUSTOM_TOKEN_TRANSFER
    return TRANSACTION_TYPE.CONTRACT_INTERACTION
  } catch (err) {
    console.error('getTransactionType error: ', err.message)
    return TRANSACTION_TYPE.CONTRACT_INTERACTION
  }
}

export default { getArweaveTransactionType: getTransactionType }
