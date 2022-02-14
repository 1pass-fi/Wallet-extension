import find from 'lodash/find'
import isEmpty from 'lodash/isEmpty'

const getAssetByTxId = (txId) => (state) => {
  let nft = find(state.assets.nfts, { txId })

  if (isEmpty(nft)) {
    nft = find(state.assets.collectionNfts, { txId })
  }
  return nft
}

export default getAssetByTxId
