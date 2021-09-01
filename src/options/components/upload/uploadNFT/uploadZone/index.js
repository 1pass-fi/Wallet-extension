import React from 'react'
import UploadNFTIcon from 'img/uploadNFT-icon.svg'
import ElectronIcon from 'img/startup/electron.svg'

import './index.css'

export default ({ className = '' }) => {
  return (
    <div className={className + ' drag-active'}>
      <div className='description'>
        <ElectronIcon className='upload-nft-icon' />
        <div className='description-detail'>
          Drag a media file here to get started.
        </div>
      </div>
    </div>
  )
}