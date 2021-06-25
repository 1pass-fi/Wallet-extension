import React from 'react'

import SendKoiIcon from 'img/send-koi-icon.svg'
import BackgroundLockIcon from 'img/background-lock-icon.svg'

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
            {type === 'lock' && 'Lock Koi Wallet'}
          </div>
        </div>
      </button>
    </div>
  )
}

export default GlobalButton
