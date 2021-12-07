import { get, isNumber } from 'lodash'

import arweave from 'services/arweave'

export default async (transactionPayload) => {
  try {
    let transaction
    console.log('[Clone transaction] input transaction: ', transactionPayload)

    if (!get(transactionPayload, 'data') && !get(transactionPayload, 'target')) {
      throw new Error('Invalid input transaction')
    }

    /* 
      If has target -> transfer ar transaction
      Else data transaction
    */
    if (get(transactionPayload, 'target')) {
      transaction = await createTransferTransaction(transactionPayload)
    } else {
      transaction = await createDataTransaction(transactionPayload)
    }

    return transaction
  } catch (err) {
    console.error(err.message)
    throw new Error('Sign transaction error')
  }
}

const createTransferTransaction = async (transactionPayload) => {
  console.log('[Clone transaction] create transfer transaction')
  if (!transactionPayload.quantity) {
    throw new Error('Quantity requried')
  }

  const quantity = isNumber(transactionPayload.quantity) 
    ? String(transactionPayload.quantity) 
    : transactionPayload.quantity

  return await arweave.createTransaction({
    quantity,
    target: transactionPayload.target
  })
}

const createDataTransaction = async (transactionPayload) => {
  console.log('[Clone transaction] create data transaction')
  // get u8
  transactionPayload.data = JSON.parse(get(transactionPayload, 'data'))
  const u8 = Uint8Array.from(Object.values(transactionPayload.data))

  // create a new transaction
  const transaction = await arweave.createTransaction({ data: u8 })
  transaction.data_root = get(transactionPayload, 'data_root')
  const tags = get(transactionPayload, 'tags')
  
  // add tags
  console.log('[Clone transaction] get tags: ', transactionPayload)
  tags.forEach(tag => {
    const tagKey = Buffer.from(tag.name, 'base64').toString()
    const tagValue = Buffer.from(tag.value, 'base64').toString()

    console.log(`${tagKey}: ${tagValue}`)
    transaction.addTag(tagKey, tagValue)
  })

  return transaction
}
