import React, { useContext, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { find, isEmpty } from 'lodash'
import { formatNumber } from 'options/utils'
import { useDispatch, useSelector } from 'react-redux'

import NFTCard from './nftCard'
import './index.css'

import { GalleryContext } from 'options/galleryContext'

import GoBack from 'img/goback-icon.svg'
import { getChromeStorage } from 'utils'
import { STORAGE } from 'constants/koiConstants'

import { setCollections } from 'options/actions/collections'

export default () => {
  const history = useHistory()

  const { showViews, showEarnedKoi } = useContext(GalleryContext)
  const { collectionId } = useParams()

  const collectionState = useSelector(state => state.collections)
  const dispatch = useDispatch()

  useEffect(() => {
    const getCollectionsFromStorage = async () => {
      const storage = await getChromeStorage(STORAGE.COLLECTIONS)
      const savedCollection = storage[STORAGE.COLLECTIONS] || []
      dispatch(setCollections({ collections: savedCollection }))
    }

    if (isEmpty(collectionState.collections)) getCollectionsFromStorage()
  }, [])

  const collection = useMemo(() => {
    console.log(collectionState.collections)
    const collection = find(collectionState.collections, collection => collection.id == collectionId)
    console.log(collection)
    if (collection) {
      return collection
    }
    return { title: '', totalViews: 0, totalReward: 0, description: '', nfts: [] }
  }, [collectionState.collections])

  const handleGoBack = () => {
    history.push('/collections')
  }

  return (
    <div className='collection-details-wrapper'>
      <div className='collection-details'>
        <div onClick={handleGoBack} className='go-back-button'><GoBack /></div>
        <div className='title'>{collection.name}</div>
        {showViews && <div className='views'>{collection.totalViews} Views</div>}
        {showEarnedKoi && <div className='earned-koi'>{formatNumber(collection.totalReward, 2)} KOII earned</div>}
        <div className='description'>{collection.description}</div>
        <div className='cards'>
          {collection.nfts.map((nft, index) => (
            <NFTCard key={index} nft={nft} />
          ))}
        </div>
      </div>
    </div>
  )
}
