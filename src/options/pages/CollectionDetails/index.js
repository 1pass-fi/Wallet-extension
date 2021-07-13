import React from 'react'

import NFTCard from './nftCard'
import './index.css'

import GoBack from 'img/goback-icon.svg'

export default ({ collection, setCollection }) => {
  const { name: title, views, earnedKoi, nfts, description } = collection

  const handleGoBack = () => {
    setCollection({})
  }

  return (
    <div className='collection-details-wrapper'>
      <div className='collection-details'>
        <div onClick={handleGoBack} className='go-back-button'><GoBack /></div>
        <div className='title'>{title}</div>
        <div className='views'>{views} Views</div>
        <div className='earned-koi'>{earnedKoi} KOII earned</div>
        <div className='description'>{description}</div>
        <div className='cards'>
          {nfts.map((nft) => (
            <NFTCard nft={nft} />
          ))}
        </div>
      </div>
    </div>
  )
}
