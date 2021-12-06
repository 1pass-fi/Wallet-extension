import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { GalleryContext } from 'options/galleryContext'
import BigCard from 'options/components/content/bigNFTCard'
import find from 'lodash/find'

export default () => {
  const { txid } = useParams()

  const assets = useSelector((state) => state.assets)

  const choosenCard = find(assets.nfts, { txId: txid })

  return choosenCard ? <BigCard {...choosenCard} /> : null
}
