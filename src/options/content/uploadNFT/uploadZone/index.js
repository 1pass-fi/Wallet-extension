import React from 'react'
import UploadNFTIcon from 'img/uploadNFT-icon.svg'

import './index.css'

export default ({ className = '' }) => {
  return (
    <div className={className + ' drag-active'}>
      <div className='description'>
        <div className='description-title'>Create an Atomic NFT</div>
        <div className='description-detail'>
          Drop your file here to store it forever and start earning attention
          rewards.
        </div>
        <UploadNFTIcon className='upload-nft-icon' />
      </div>
    </div>
  )
}
