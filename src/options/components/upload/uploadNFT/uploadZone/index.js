import React, { useContext } from 'react'
import UploadNFTIcon from 'img/uploadNFT-icon.svg'
import ElectronIcon from 'img/startup/electron.svg'

import './index.css'
import { GalleryContext } from 'options/galleryContext'

export default ({ className = '' }) => {
  const { inputFileRef } = useContext(GalleryContext)

  return (
    <div onClick={() => inputFileRef.current.click()} className={className + ' drag-active'}>
      <div className='description-create-nft'>
        <ElectronIcon className='upload-nft-icon' />
        <div className='description-detail'>
          Drag a media file here to get started.
        </div>
      </div>
    </div>
  )
}