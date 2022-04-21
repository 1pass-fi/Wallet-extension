import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import NFTCard from 'finnie-v2/components/NFTCard'
import { GalleryContext } from 'options/galleryContext'

import './index.css'

const Gallery = () => {
  const { setIsLoading } = useContext(GalleryContext)
  const filteredNfts = useSelector((state) => state.assets.filteredNfts)
  const [displayingNfts, setDisplayingNfts] = useState(filteredNfts.slice(0, 16))
  const [dislayLength, setDisplayLength] = useState(filteredNfts.length)

  useEffect(() => {
    if (dislayLength === filteredNfts.length) {
      return
    } else {
      setDisplayLength(filteredNfts.length)
      setDisplayingNfts(filteredNfts.slice(0, 16))
    }
  }, [filteredNfts])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight
    if (bottom && displayingNfts.length < filteredNfts.length) {
      setIsLoading((prev) => ++prev)
      setTimeout(() => {
        setDisplayingNfts([
          ...displayingNfts,
          ...filteredNfts.slice(displayingNfts.length, displayingNfts.length + 16)
        ])
        setIsLoading((prev) => --prev)
      }, 700)
    }
  }

  return (
    <div id="gallery" className="w-full flex justify-center items-center" onScroll={handleScroll}>
      <div className="h-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 place-items-start">
        {displayingNfts?.map((nft) => (
          <NFTCard nft={nft} key={nft.txId} />
        ))}
      </div>
    </div>
  )
}

export default Gallery
