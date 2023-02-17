import React, { useContext } from 'react'
import { GalleryContext } from 'options/galleryContext'
import Modal from 'options/shared/UploadMessageModal'

import './index.css'

const SuccessUploadNFT = () => {
  const { pendingNFTTitle } = useContext(GalleryContext)

  return (
    <div className='success-upload-modal'>
      <div className='description'>
        Hooray! <b>{pendingNFTTitle}</b> {chrome.i18n.getMessage('UploadToARPermaweb')}
      </div>
      <div></div>
    </div>
  )
}

export default ({ onClose }) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <SuccessUploadNFT />
      </Modal>
    </div>
  )
}
