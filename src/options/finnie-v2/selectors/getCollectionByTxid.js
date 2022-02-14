import { find } from 'lodash'

const getCollectionByTxId = (txId) => (state) => {
  const collection = find(state.collections.collections, c => {
    return c.id === txId
  })

  return collection
}

export default getCollectionByTxId
