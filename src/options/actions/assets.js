import store from '../store'
import { SET_ASSETS, SET_FILTER_NFTS } from './types'

export const setAssets = (payload) => (dispatch) => {
  dispatch({
    type: SET_ASSETS,
    payload
  })
}

export const filterNft = ({ searchStr, chainType }) => (dispatch) => {
  const nfts = store.getState().assets.nfts
  let filteredNfts = nfts.filter((nft) => nft.name.includes(searchStr))
  if (chainType) {
    filteredNfts = filteredNfts.filter((nft) => nft.type === chainType)
  }

  dispatch({
    type: SET_FILTER_NFTS,
    payload: filteredNfts
  })
}
