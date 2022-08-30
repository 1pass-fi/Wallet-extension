// modules
import React from 'react'
import BackgroundLockIcon from 'img/background-lock-icon.svg'
// assets
import SendKoiIcon from 'img/send-koi-icon.svg'

// styles
import './index.css'


const GlobalButton = ({ onClick, type = 'send', currency=''}) => {
  return (
    <div onClick={onClick}>
      <button className='global-button'>
        <div className='global-button-content'>
          <div className='global-button-icon' >
            {type === 'send' && <SendKoiIcon />}
            {type === 'lock' && <BackgroundLockIcon />}
          </div>
          <div className='global-button-label'>
            {type === 'send' && `Send tokens`}
            {type === 'lock' && 'Lock Koii Wallet'}
          </div>
        </div>
      </button>
    </div>
  )
}

export default GlobalButton
