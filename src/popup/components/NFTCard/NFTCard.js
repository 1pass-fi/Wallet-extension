import React from 'react'

import NFTMedia from 'finnie-v2/components/NFTMedia'

const NFTCard = ({ nft }) => {
  return (
    <div
      className="flex justify-center items-center w-full h-37.75"
      style={{ width: '130px', height: '135px' }}
    >
      <NFTMedia contentType={nft.contentType} source={nft.imageUrl} />
    </div>
  )
}

export default NFTCard
