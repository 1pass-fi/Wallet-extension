import React from 'react'
import { useSelector } from 'react-redux'

import CollectionCard from 'options/components/collectionCard'

import './index.css'

export default () => {
  const collectionState = useSelector(state => state.collections)

  return (
    <div className='collection-list-wrapper'>
      <div className='collection-list'>
        {collectionState.collections.map((collection, index) => (
          <CollectionCard key={index} collection={collection} />
        ))}
      </div>
    </div>
  )
}
