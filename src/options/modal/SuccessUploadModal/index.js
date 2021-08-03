import React from 'react'

import './index.css'
import Modal from 'options/shared/modal'

const SuccessUploadNFT = () => {
  return (
    <div className='success-upload-modal'>
      <div className='title'>
        Share to earn Attention Rewards
      </div>
      <div className='description'>
        You can share your NFT as soon as it is written to the blockchain.
        <br></br>
        <br></br>
        This should only take a few minutes and you will get a notification in the extension as soon as it is ready to go!
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
