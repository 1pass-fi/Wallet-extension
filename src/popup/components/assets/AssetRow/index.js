import React from 'react'
import PropTypes from 'prop-types'

import ShareIcon from 'img/share-icon.svg'
import GalleryIcon from 'img/gallery-icon.svg'
import Fish from 'img/fish.svg'
import AlternativeWalletIcon from 'img/alternative-wallet-icon.svg'
import RearrangePadsIcon from 'img/rearrange-pads-icon.svg'
import './index.css'

const propTypes = {
  isGrey: PropTypes.bool,
  isKoiWallet: PropTypes.bool,
  name: PropTypes.string,
  isRegistered: PropTypes.bool,
  earnedKoi: PropTypes.number,
}

const WalletIcon = ({ isKoiWallet }) => (
  <div className="asset-row-logo-icon">
    { isKoiWallet ?
      <Fish />
      :
      <AlternativeWalletIcon />}
  </div>
)

const EarnedKoi = ({ isRegistered, earnedKoi }) => (
  isRegistered ?
    <div className="koi-earned">
      {earnedKoi} KOI earned
    </div>
    :
    <button className="register-button">
      <div className="register-button-icon">
        <div className='assets fish-icon'><Fish /></div>
      </div>
      <span>Register</span>
    </button>
)

const Actions = ({ isRegistered, viewblockUrl, galleryUrl }) => {

  const handleCreateTab = (to) => {
    chrome.tabs.create({
      url: to
    })
  }

  return (
    <div className="asset-row-function-icons">
      { isRegistered && <div onClick={() => handleCreateTab(viewblockUrl)}><ShareIcon className="asset-row-function-icon" /></div>}
      <div onClick={() => handleCreateTab(galleryUrl)}><GalleryIcon className="asset-row-function-icon" /></div>
    </div>
  )
}

const AssetRow = ({ isGrey, isKoiWallet, name, isRegistered, earnedKoi, viewblockUrl, galleryUrl }) => {
  return (
    <div className="asset-row-container" style={{ background: isGrey ? '#EEEEEE' : '#fff' }}>
      <div className="asset-row-rearrange-icon">
        <RearrangePadsIcon />
      </div>
      <WalletIcon isKoiWallet={isKoiWallet} />
      <div className="asset-name">{name}</div>
      <EarnedKoi isRegistered={isRegistered} earnedKoi={earnedKoi} />
      <Actions isRegistered={isRegistered} viewblockUrl={viewblockUrl} galleryUrl={galleryUrl} />
    </div>
  )
}

AssetRow.propTypes = propTypes

export default AssetRow
