import React from 'react'
import { useSelector } from 'react-redux'

import NftSelectCard from './SelectNftCard'

export default () => {
  const assets = useSelector(state => state.assets)

  const excludedPath = [
    '/collections/create'
  ]

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-x-5 gap-y-3.75 place-items-center'>
      {assets.nfts.map(cardInfo => (
        <NftSelectCard nft={cardInfo}/>
      ))}
    </div>      
  )    
}
