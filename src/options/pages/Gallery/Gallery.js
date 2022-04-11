import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import NFTCard from 'finnie-v2/components/NFTCard'

import './index.css'

const Gallery = () => {
  const filteredNfts = useSelector((state) => state.assets.filteredNfts)
  const [displayingNfts, setDisplayingNfts] = useState([])
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
      setDisplayingNfts([
        ...displayingNfts,
        ...filteredNfts.slice(displayingNfts.length, displayingNfts.length + 16)
      ])
    }
  }

  return (
    <div
      id="gallery"
      className="w-full flex justify-center items-center scroll"
      onScroll={handleScroll}
      style={{ height: '85vh', overflow: 'scroll' }}
    >
      <div
        className="grid h-full grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 place-items-center"
        style={{ minHeight: '86vh' }}
      >
        {displayingNfts.map((nft) => (
          <NFTCard nft={nft} key={nft.txId} />
        ))}
      </div>
    </div>
  )
}

export default Gallery
