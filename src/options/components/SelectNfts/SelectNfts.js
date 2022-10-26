import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { uniqueId } from 'lodash'
import { setEditingCollectionId } from 'options/actions/editingCollectionId'
import { setSelectedNftIds } from 'options/actions/selectedNftIds'
import getCollectionByTxId from 'options/selectors/getCollectionByTxid'

import NftSelectCard from './SelectNftCard'

export default () => {
  const { collectionId } = useParams()
  const dispatch = useDispatch()

  const selectedNftIds = useSelector((state) => state.selectedNftIds)
  const assets = useSelector((state) => state.assets)
  const collection = useSelector(getCollectionByTxId(collectionId))

  useEffect(() => {
    if (collectionId) dispatch(setEditingCollectionId(collectionId))
    if (collection) dispatch(setSelectedNftIds(collection.collection))
  }, [collectionId, collection])

  const nfts = useMemo(() => {
    // bring selected nfts to top
    if (collection) {
      const selectedNfts = assets.nfts.filter((nft) => selectedNftIds.includes(nft.txId))
      const nonSelectedNfts = assets.nfts.filter((nft) => !selectedNftIds.includes(nft.txId))
      return [...selectedNfts, ...nonSelectedNfts]
    }

    return assets.nfts
  }, [collection, assets])

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 5xl:grid-cols-8 gap-x-5 gap-y-3.75 place-items-center">
      {nfts.map((cardInfo) => (
        <NftSelectCard key={uniqueId()} nft={cardInfo} />
      ))}
    </div>
  )
}
