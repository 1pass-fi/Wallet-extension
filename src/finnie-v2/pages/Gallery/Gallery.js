import React from 'react'
import { useSelector } from 'react-redux'

import NFTCard from 'finnie-v2/components/NFTCard'

const Gallery = () => {
  const filteredNfts = useSelector((state) => state.assets.filteredNfts)

  return (
    <div className="w-full flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-5 place-items-center">
        {filteredNfts.map((nft) => (
          <NFTCard nft={nft} key={nft.txId} />
        ))}
      </div>
    </div>
  )
}

export default Gallery
