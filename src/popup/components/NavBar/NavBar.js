import React from 'react'
import { isEmpty } from 'lodash'

import GalleryIcon from 'img/popup/gallery-icon.svg'
import AddIcon from 'img/popup/add-icon.svg'
import LockIcon from 'img/popup/lock-icon.svg'

const NavBar = ({ handleLockWallet }) => {
  const goToGallery = () => {
    const url = chrome.extension.getURL('options.html#/gallery')
    chrome.tabs.create({ url })
  }

  const goToCreateNft = () => {
    const url = chrome.extension.getURL('options.html#/create-nft')
    chrome.tabs.create({ url })
  }

  return (
    <div className="footer">
      <div className="footer-item gallery" onClick={goToGallery}>
        <GalleryIcon style={{ width: '26px', height: '21px', marginTop: '6px' }} />
        GALLERY
      </div>
      <div className="footer-item new-nft" onClick={goToCreateNft}>
        <AddIcon style={{ width: '25px', height: '25px', marginTop: '6px' }} />
        NEW NFT
      </div>
      <div className="footer-item lock" onClick={handleLockWallet}>
        <LockIcon style={{ width: '18px', height: '25px', marginTop: '6px' }} />
        LOCK
      </div>
    </div>
  )
}

export default NavBar
