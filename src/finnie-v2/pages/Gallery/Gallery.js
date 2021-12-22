import React from 'react'
import { useSelector } from 'react-redux'

import MainLayout from 'finnie-v2/components/MainLayout'
import NFTCard from 'finnie-v2/components/NFTCard'

const Gallery = () => {
  const filteredNfts = useSelector((state) => state.assets.filteredNfts)

  return (
    <MainLayout title="Gallery">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-3.75 place-items-center">
        {filteredNfts.map((nft) => (
          <NFTCard nft={nft} key={nft.txId} />
        ))}
      </div>
    </MainLayout>
  )
}

export default Gallery
