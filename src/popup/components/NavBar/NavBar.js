import React from 'react'
import { useHistory } from 'react-router-dom'
import AddIcon from 'img/popup/add-icon.svg'
import GalleryIcon from 'img/popup/gallery-icon.svg'
import LockIcon from 'img/popup/lock-icon.svg'
import GlobeIcon from 'img/wallet-connect/globe-icon.svg'

const NavBar = ({ handleLockWallet }) => {
  const history = useHistory()

  const goToGallery = () => {
    const url = chrome.runtime.getURL('options.html#/gallery')
    chrome.tabs.create({ url })
  }

  const goToWalletConnect = () => {
    history.push('/wallet-connect-proposal')
  }

  return (
    <div
      className="flex items-center justify-between fixed bottom-0 px-0.75"
      style={{ height: '64px', backgroundColor: '#4e4e7e' }}
    >
      <div
        className="bg-blue-800 cursor-pointer rounded-bl-md"
        style={{ width: '138px', height: '58px' }}
        onClick={goToGallery}
      >
        <GalleryIcon className="mt-1.5 mx-auto" style={{ width: '26px', height: '21px' }} />
        <div className="text-center text-white text-2xs leading-8">{chrome.i18n.getMessage('GALLERY')}</div>
      </div>
      <div
        className="bg-blue-800 cursor-pointer mx-0.75"
        style={{ width: '138px', height: '58px' }}
        onClick={goToWalletConnect}
      >
        <GlobeIcon className="mx-auto" />
        <div className="text-center text-white text-2xs leading-6">{chrome.i18n.getMessage('CONNECT')}</div>
      </div>
      <div
        className="bg-blue-800 cursor-pointer rounded-br-md"
        style={{ width: '138px', height: '58px' }}
        onClick={handleLockWallet}
      >
        <LockIcon className="mt-1.5 mx-auto" style={{ width: '18px', height: '25px' }} />
        <div className="text-center text-white text-2xs leading-8">{chrome.i18n.getMessage('LOCK')}</div>
      </div>
    </div>
  )
}

export default NavBar
