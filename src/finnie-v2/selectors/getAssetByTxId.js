import find from 'lodash/find'

const getAssetByTxId = (txId) => (state) => {
  return find(state.assets.nfts, { txId })
}

export default getAssetByTxId
