import isEmpty from 'lodash/isEmpty'

import store from '../store'
import { SET_ASSETS, SET_FILTER_NFTS } from './types'

export const setAssets = (payload) => (dispatch) => {
  dispatch({
    type: SET_ASSETS,
    payload
  })
}

export const SORT_TYPES = {
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
  MOST_VIEWED: 'MOST_VIEWED'
}

const sortNfts = (nfts, sortType) => {
  switch (sortType) {
    case SORT_TYPES.NEWEST:
      return nfts.sort((a, b) => a.createdAt - b.createdAt)
    case SORT_TYPES.OLDEST:
      return nfts.sort((a, b) => -a.createdAt + b.createdAt)
    case SORT_TYPES.MOST_VIEWED:
      return nfts.sort((a, b) => -a.totalViews + b.totalViews)
    default:
      return nfts
  }
}

export const filterNft = ({ searchStr, chainType, sortType }) => async (dispatch) => {
  try {
    let filteredNfts = store.getState().assets.nfts

    if (!isEmpty(searchStr)) {
      filteredNfts = filteredNfts.filter((nft) => nft.name.includes(searchStr))
    }

    if (!isEmpty(chainType)) {
      filteredNfts = filteredNfts.filter((nft) => nft.type === chainType)
    }

    if (!isEmpty(sortType)) {
      filteredNfts = sortNfts(filteredNfts, sortType)
    }

    dispatch({
      type: SET_FILTER_NFTS,
      payload: filteredNfts
    })
  } catch (error) {
    console.log(error)
  }
}
