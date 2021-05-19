import React from 'react'
import SendKoiIcon from 'img/send-koi-icon.svg'

import './index.css'

const SendKoiButton = ({ handleClick }) => {
  return (
    <div className='send-koi-button-container'>
      <button className='send-koi-button' onClick={handleClick}>
        <div className='send-koi-icon' >
          <SendKoiIcon />
        </div>
        <div className='send-koi-label'>Send KOI</div>
      </button>
    </div>
  )
}

export default SendKoiButton
