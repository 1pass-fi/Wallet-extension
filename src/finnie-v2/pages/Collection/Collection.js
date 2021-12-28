import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import CreateIcon from 'img/v2/create-icon.svg'

import MainLayout from 'finnie-v2/components/MainLayout'
import CollectionCard from 'finnie-v2/components/CollectionCard'

const Collection = () => {
  const filteredCollections = useSelector((state) => state.collections.filteredCollections)

  return (
    <MainLayout title="Gallery">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-6 place-items-center">
        <Link
          to="/v2/collections/create"
          className="w-50 h-60 flex flex-col items-center justify-center border border-dashed border-white rounded"
        >
          <CreateIcon className="w-11.25 h-11.25" />
          <div className="text-white text-base leading-6 tracking-finnieSpacing-wide mt-4 w-32 text-center">
            Create New Collection
          </div>
        </Link>
        {filteredCollections.map((collection) => (
          <CollectionCard collection={collection} key={collection.id} />
        ))}
      </div>
    </MainLayout>
  )
}

export default Collection
