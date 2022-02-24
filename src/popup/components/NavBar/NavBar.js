import React from 'react'

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
    <div
      className="flex items-center w-full justify-between fixed bottom-0 px-0.75"
      style={{ height: '64px', backgroundColor: '#4e4e7e' }}
    >
      <div
        className="bg-blue-800 cursor-pointer rounded-bl-md"
        style={{ width: '138px', height: '58px' }}
        onClick={goToGallery}
      >
        <GalleryIcon className="mt-1.5 mx-auto" style={{ width: '26px', height: '21px' }} />
        <div className="text-center text-white text-2xs leading-8">GALLERY</div>
      </div>
      <div
        className="bg-blue-800 cursor-pointer"
        style={{ width: '138px', height: '58px' }}
        onClick={goToCreateNft}
      >
        <AddIcon className="mt-1.5 mx-auto" style={{ width: '25px', height: '25px' }} />
        <div className="text-center text-white text-2xs leading-8">NEW NFT</div>
      </div>
      <div
        className="bg-blue-800 cursor-pointer rounded-br-md"
        style={{ width: '138px', height: '58px' }}
        onClick={handleLockWallet}
      >
        <LockIcon className="mt-1.5 mx-auto" style={{ width: '18px', height: '25px' }} />
        <div className="text-center text-white text-2xs leading-8">LOCK</div>
      </div>
    </div>
  )
}

export default NavBar