import React, { useContext, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { uniqueId } from 'lodash'
import { setSelectedNftIds } from 'options/actions/selectedNftIds'
import { GalleryContext } from 'options/galleryContext'
import getCollectionByTxId from 'options/selectors/getCollectionByTxid'

import NftSelectCard from './SelectNftCard'

export default () => {
  const { collectionId } = useParams()
  const { setEditingCollectionId } = useContext(GalleryContext)
  const dispatch = useDispatch()

  const selectedNftIds = useSelector((state) => state.selectedNftIds)
  const assets = useSelector((state) => state.assets)
  const collection = useSelector(getCollectionByTxId(collectionId))

  useEffect(() => {
    if (collectionId) setEditingCollectionId(collectionId)
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-3.75 place-items-center">
      {nfts.map((cardInfo) => (
        <NftSelectCard key={uniqueId()} nft={cardInfo} />
      ))}
    </div>
  )
}
