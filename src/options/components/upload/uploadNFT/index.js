import React, { useContext, useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import { GalleryContext } from 'options/galleryContext'

import UploadZone from './uploadZone'
import UploadForm from './uploadForm'
import './index.css'

export default () => {
  const { file } = useContext(GalleryContext)
  const [stage, setStage] = useState(1)
  
  return (
    <div className='uploadNFT-wrapper'>
      <div className={stage === 3 ? 'uploadNFT stage3' : 'uploadNFT'}>
        {isEmpty(file) ? <UploadZone /> : <UploadForm stage={stage} setStage={setStage}/>}
      </div>
    </div>
  )
}
