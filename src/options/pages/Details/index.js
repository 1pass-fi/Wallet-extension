import React, { useContext } from 'react'
import { useParams } from 'react-router'
import { GalleryContext } from 'options/galleryContext'
import BigCard from 'options/components/content/bigNFTCard'
import find from 'lodash/find'

export default () => {
  const { txid } = useParams()

  const { cardInfos } = useContext(GalleryContext)
  const choosenCard = find(cardInfos, { txId: txid })

  return choosenCard ? <BigCard {...choosenCard} /> : null
}
