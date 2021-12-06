import React from 'react'

import MainLayout from 'finnie-v2/components/MainLayout'
import NFTCard from 'finnie-v2/components/NFTCard'

const Gallery = () => {
  return (
    <MainLayout title="Gallery">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-3.75 place-items-center">
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
        <NFTCard />
      </div>
    </MainLayout>
  )
}

export default Gallery
