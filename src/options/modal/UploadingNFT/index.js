  
import React from 'react'
import Modal from 'options/shared/UploadMessageModal'

import './index.css'

const PendingUploadNFT = () => {
  return (
    <div className='pending-upload-modal'>
      <div className='description'>
        Your NFT is waiting patiently to be added to the permaweb.
        <br></br>
        <br></br>
        You will be notified when it is uploaded!
      </div>
      <div></div>
    </div>
  )
}

export default ({ onClose }) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <PendingUploadNFT />
      </Modal>
    </div>
  )
}
