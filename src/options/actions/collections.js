import { TYPE } from 'constants/accountConstants'
import isEmpty from 'lodash/isEmpty'

import store from '../store'

import { SET_COLLECTIONS, SET_FILTER_COLLECTIONS } from './types'

export const setCollections = (payload) => (dispatch) => {
  dispatch({
    type: SET_COLLECTIONS,
    payload
  })
}

export const SORT_TYPES = {
  NEWEST: 'NEWEST',
  OLDEST: 'OLDEST',
  MOST_VIEWED: 'MOST_VIEWED'
}

const sortCollection = (collections, sortBy) => {
  // TODO - handle createAt field
  switch (sortBy) {
    case SORT_TYPES.NEWEST:
      return collections.sort((a, b) => a.createdAt - b.createdAt)
    case SORT_TYPES.OLDEST:
      return collections.sort((a, b) => -a.createdAt + b.createdAt)
    case SORT_TYPES.MOST_VIEWED:
      return collections.sort((a, b) => -a.totalViews + b.totalViews)
    default:
      return collections
  }
}

export const filterCollection = ({ searchStr, chainType, sortBy }) => async (dispatch) => {
  try {
    let filteredCollections = store.getState().collections.collections

    if (!isEmpty(searchStr)) {
      filteredCollections = filteredCollections.filter((collection) =>
        collection.name?.toLowerCase().includes(searchStr.toLowerCase())
      )
    }

    if (!isEmpty(chainType)) {
      // TODO - handle filter collections by ETH type
      if (chainType === TYPE.ETHEREUM) filteredCollections = []
    }

    if (!isEmpty(sortBy)) {
      filteredCollections = sortCollection(filteredCollections, sortBy)
    }

    dispatch({
      type: SET_FILTER_COLLECTIONS,
      payload: filteredCollections
    })
  } catch (error) {
    console.log(error)
  }
}
