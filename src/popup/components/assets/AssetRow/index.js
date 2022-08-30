// modules
import React from 'react'
import AlternativeWalletIcon from 'img/ethereum-logo.svg'
import GalleryIcon from 'img/gallery-icon.svg'
import Fish from 'img/koi-logo.svg'
import RearrangePadsIcon from 'img/rearrange-pads-icon.svg'
// assets
import ShareIcon from 'img/share-icon-green.svg'
import PropTypes from 'prop-types'
// utils
import { numberFormat } from 'utils'

// styles
import './index.css'

const propTypes = {
  isGrey: PropTypes.bool,
  isKoiWallet: PropTypes.bool,
  name: PropTypes.string,
  isRegistered: PropTypes.bool,
  earnedKoi: PropTypes.number,
}

const WalletIcon = ({ isKoiWallet }) => (
  <div className='asset-row-logo-icon'>
    {isKoiWallet ? <Fish /> : <AlternativeWalletIcon />}
  </div>
)

const EarnedKoi = ({ isRegistered, earnedKoi }) =>
  isRegistered ? (
    <div className='koi-earned'>{numberFormat(earnedKoi)} KOII earned</div>
  ) : (
    <></>
    // <button className='register-button'>
    //   <div className='register-button-icon'>
    //     <div className='assets fish-icon'>
    //       <Fish />
    //     </div>
    //   </div>
    //   <span>Register</span>
    // </button>
  )

const Actions = ({ isRegistered, koiRockUrl, galleryUrl }) => {
  const handleCreateTab = (to) => {
    chrome.tabs.create({
      url: to,
    })
  }

  return (
    <div className='asset-row-function-icons'>
      {isRegistered && (
        <div onClick={() => handleCreateTab(koiRockUrl)}>
          <ShareIcon className='asset-row-function-icon' />
        </div>
      )}
      <div onClick={() => handleCreateTab(galleryUrl)}>
        <GalleryIcon className='asset-row-function-icon' />
      </div>
    </div>
  )
}

const AssetRow = ({
  isGrey,
  isKoiWallet,
  name,
  isRegistered,
  earnedKoi,
  koiRockUrl,
  galleryUrl,
}) => {
  return (
    <div
      className='asset-row-container'
      style={{ background: isGrey ? '#EEEEEE' : '#fff' }}
    >
      <div className='asset-row-rearrange-icon'>
        <RearrangePadsIcon />
      </div>
      <WalletIcon isKoiWallet={isKoiWallet} />
      <div className='asset-name'>{name}</div>
      <EarnedKoi isRegistered={isRegistered} earnedKoi={earnedKoi} />
      <Actions
        isRegistered={isRegistered}
        koiRockUrl={koiRockUrl}
        galleryUrl={galleryUrl}
      />
    </div>
  )
}

AssetRow.propTypes = propTypes

export default AssetRow
