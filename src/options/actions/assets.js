import store from '../store'
import { SET_ASSETS, SET_FILTER_NFTS } from './types'

export const setAssets = (payload) => (dispatch) => {
  dispatch({
    type: SET_ASSETS,
    payload
  })
}

export const filterNft = (searchStr) => (dispatch) => {
  const nfts = store.getState().assets.nfts
  const filteredNfts = nfts.filter((nft) => nft.name.includes(searchStr))

  dispatch({
    type: SET_FILTER_NFTS,
    payload: filteredNfts
  })
}
