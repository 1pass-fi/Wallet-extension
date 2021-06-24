import React, { useContext } from 'react'
import isEmpty from 'lodash/isEmpty'

import { GalleryContext } from 'options/galleryContext'

import UploadZone from './uploadZone'
import UploadForm from './uploadForm'
import './index.css'

export default () => {
  const { file, isDragging } = useContext(GalleryContext)
  if (!isDragging) {
    return <div></div>
  }

  return (
    <div className='uploadNFT-wrapper'>
      <div className={`uploadNFT`}>
        {isEmpty(file) ? <UploadZone /> : <UploadForm />}
      </div>
    </div>
  )
}
