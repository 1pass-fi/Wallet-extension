import React from 'react'

import CollectionCard from 'options/components/collectionCard'

import './index.css'

export default ({ collections = [] }) => {
  return (
    <div className='collection-list-wrapper'>
      <div className='collection-list'>
        {collections.map((collection) => (
          <CollectionCard collection={collection} />
        ))}
      </div>
    </div>
  )
}
