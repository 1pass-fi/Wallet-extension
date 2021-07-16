import React from 'react'

import KoiIcon from 'img/koi-logo.svg'

import './index.css'

export default () => {
  return (
    <header className='lock-screen-header'>
      <KoiIcon className='koi-icon' />
      <div className='koi-title'>Koii Wallet</div>
    </header>
  )
}
