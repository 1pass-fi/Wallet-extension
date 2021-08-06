import React from 'react'

import CloseIcon from 'img/close-x-icon-small.svg'

import './index.css'

export default ({ onClose }) => {
  return (
    <div className='waiting-add-nft-wrapper'>
      <div className='waiting-add-nft'>
        <div>Your NFT is waiting patiently to be added to the permaweb.</div>
        <div>
          You will be notified when it is on-chain and ready to be shared!
        </div>

        <CloseIcon onClick={onClose} className='close-button' />
      </div>
    </div>
  )
}
