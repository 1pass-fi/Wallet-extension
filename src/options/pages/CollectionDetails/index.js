import React, { useContext, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { useParams } from 'react-router'
import { find } from 'lodash'

import NFTCard from './nftCard'
import './index.css'

import { GalleryContext } from 'options/galleryContext'

import GoBack from 'img/goback-icon.svg'

export default () => {
  const history = useHistory()

  const { collections } = useContext(GalleryContext)
  const { collectionId } = useParams()

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
        <div className='views'>{collection.views} Views</div>
        <div className='earned-koi'>{collection.earnedKoi} KOII earned</div>
        <div className='description'>{collection.description}</div>
        <div className='cards'>
          {collection.nfts.map((nft) => (
            <NFTCard nft={nft} />
          ))}
        </div>
      </div>
    </div>
  )
}
