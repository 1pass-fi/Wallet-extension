import React from 'react'
import isEmpty from 'lodash/isEmpty'

import UploadZone from './uploadZone'
import UploadForm from './uploadForm'
import './index.css'

export default ({ file, isDragging, onClearFile, onCloseUploadModal }) => {
  if (!isDragging) {
    return <div></div>
  }

  return (
    <div className='uploadNFT-wrapper'>
      <div className={`uploadNFT`}>
        {isEmpty(file) ? (
          <UploadZone />
        ) : (
          <UploadForm
            file={file}
            onClearFile={onClearFile}
            onCloseUploadModal={onCloseUploadModal}
          />
        )}
      </div>
    </div>
  )
}
