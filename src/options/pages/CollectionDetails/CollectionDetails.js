import React, { useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { find, isEmpty, get } from 'lodash'

import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

import EditIcon from 'img/v2/collection-detail/edit-icon.svg'

import NftCard from './NftCard'

const CollectionDetails = () => {
  const history = useHistory()
  const { collectionId } = useParams()

  const collectionState = useSelector(state => state.collections)
  const assets = useSelector(state => state.assets)

  const nftLoaded = useMemo(() => {
    return !isEmpty(assets.nfts)
  }, [assets.nfts])


  const collection = useMemo(() => {
    const collection = find(
      collectionState.collections,
      (collection) => collection.id === collectionId
    )

    if (collection) {
      return collection
    }
    return { title: '', totalViews: 0, totalReward: 0, description: '', collection: [] }
  }, [collectionState.collections])

  const openEditCollectionForm = () => {
    history.push('/collections/' + collectionId + '/edit') 
  }

  return (
    <div className=' w-full'>
      {/* DESCRIPTION */}
      <div 
        onClick={openEditCollectionForm}
        className='text-white w-full h-25.5 text-sm leading-6 pr-3 mb-3'
        style={{
          overflowY: 'overlay'
        }}
      >{get(collection, 'description')}{get(collection, 'description')}{get(collection, 'description')}</div>
      {/* NFT CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-3.75 place-items-stretch'>
        {nftLoaded && collection?.collection?.map((nft, index) => (
          <NftCard key={index} nft={nft} />
        ))}
      </div>
    </div>
  )
}

export default CollectionDetails
