import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import formatLongString from 'finnie-v2/utils/formatLongString'

import NFTMedia from 'finnie-v2/components/NFTMedia'

import getAssetByTxId from 'options/selectors/getAssetByTxId'

const CollectionCard = ({ collection }) => {
  const nft = useSelector(getAssetByTxId(collection.collection[0]))

  return (
    <Link
      to={`/collections/${collection.id}`}
      className="relative text-white rounded w-50 h-60 pt-1.75 px-1.75"
    >
      <div className="rounded shadow absolute top-0 left-3.5 bg-blue-800 w-47.25 h-56.5" />
      <div className="rounded shadow absolute top-1.375 left-1.75 bg-blue-800 w-47.25 h-56.5" />
      <div className="rounded shadow absolute top-2.75 left-0 bg-blue-800 w-47.25 h-56.5" />

      <div className="absolute top-5 left-0 w-47.25 flex flex-col items-center">
        <div className="rounded flex justify-center items-center w-43 h-40">
          {nft ? (
            <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
          ) : (
            <NFTMedia contentType="not-register-data" />
          )}
        </div>
        <div className="mt-1 text-base tracking-finnieSpacing-wide text-center">
          {formatLongString(collection.name, 20)}
        </div>
      </div>
    </Link>
  )
}

export default CollectionCard
