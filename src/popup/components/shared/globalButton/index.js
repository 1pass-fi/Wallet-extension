import React from 'react'

import SendKoiIcon from 'img/send-koi-icon.svg'
import BackgoundLockIcon from 'img/background-lock-icon.svg'

import './index.css'

const GlobalButton = ({ onClick, type='send' }) => {
  return (
    <button className='global-button'>
      <div className='global-button-content' onClick={onClick}>
        <div className='global-button-icon' >
          {type ==='send' && <SendKoiIcon />}
          {type === 'lock' && <BackgoundLockIcon />}
        </div>
        <div className='global-button-label'>
          {type === 'send' && 'Send KOI'}
          {type === 'lock' && 'Lock Koi Wallet'}
        </div>
      </div>
    </button>
  )
}

export default GlobalButton
