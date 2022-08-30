import isEmpty from 'lodash/isEmpty'

import store from '../store'

import { SET_ASSETS, SET_COLLECTION_NFTS, SET_FILTER_NFTS } from './types'

export const setAssets = (payload) => (dispatch) => {
  const nfts = payload.nfts?.sort((a, b) => b.createdAt - a.createdAt) || []
  const filteredNfts = payload.filteredNfts?.sort((a, b) => b.createdAt - a.createdAt) || []

  dispatch({
    type: SET_ASSETS,
    payload: { ...payload, nfts, filteredNfts }
  })
}

export const setCollectionNfts = (payload) => (dispatch) => {
  dispatch({
    type: SET_COLLECTION_NFTS,
    payload
  })
}

export const SORT_TYPES = {
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
  MOST_VIEWED: 'MOST_VIEWED'
}

const sortNfts = (nfts, sortBy) => {
  switch (sortBy) {
    case SORT_TYPES.OLDEST:
      return nfts.sort((a, b) => a.createdAt - b.createdAt)
    case SORT_TYPES.NEWEST:
      return nfts.sort((a, b) => b.createdAt - a.createdAt)
    case SORT_TYPES.MOST_VIEWED:
      return nfts.sort((a, b) => b.totalViews - a.totalViews)
    default:
      return nfts
  }
}

export const filterNft = ({ searchStr, chainType, sortBy }) => async (dispatch) => {
  try {
    let filteredNfts = store.getState().assets.nfts

    if (!isEmpty(searchStr)) {
      filteredNfts = filteredNfts.filter((nft) =>
        nft.name?.toLowerCase().includes(searchStr.toLowerCase())
      )
    }

    if (!isEmpty(chainType)) {
      filteredNfts = filteredNfts.filter((nft) => nft.type === chainType)
    }

    if (!isEmpty(sortBy)) {
      filteredNfts = sortNfts(filteredNfts, sortBy)
    }

    dispatch({
      type: SET_FILTER_NFTS,
      payload: filteredNfts
    })
  } catch (error) {
    console.log(error)
  }
}
