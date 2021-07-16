import React, { useContext, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { find, isEmpty } from 'lodash'

import NFTCard from './nftCard'
import './index.css'

import { GalleryContext } from 'options/galleryContext'

import GoBack from 'img/goback-icon.svg'
import { getChromeStorage } from 'utils'
import { STORAGE } from 'koiConstants'

export default () => {
  const history = useHistory()

  const { showViews, showEarnedKoi, collections, setCollections } = useContext(GalleryContext)
  const { collectionId } = useParams()

  useEffect(() => {
    const getCollectionsFromStorage = async () => {
      const storage = await getChromeStorage(STORAGE.COLLECTIONS)
      const savedCollection = storage[STORAGE.COLLECTIONS] || []
      setCollections(savedCollection)
    }

    if (isEmpty(collections)) getCollectionsFromStorage()
  }, [])

  const collection = useMemo(() => {
    console.log('RUNNING')
    console.log(collections)
    const collection = find(collections, collection => collection.id == collectionId)
    console.log(collection)
    if (collection) {
      return collection
    }
    return { title: '', views: '', earnedKoi: 0, description: '', nfts: [] }
  }, [collections])

  const handleGoBack = () => {
    history.push('/collections')
  }

  return (
    <div className='collection-details-wrapper'>
      <div className='collection-details'>
        <div onClick={handleGoBack} className='go-back-button'><GoBack /></div>
        <div className='title'>{collection.name}</div>
        {showViews && <div className='views'>{collection.views} Views</div>}
        {showEarnedKoi && <div className='earned-koi'>{collection.earnedKoi} KOII earned</div>}
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
