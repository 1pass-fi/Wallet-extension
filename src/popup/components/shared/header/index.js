// modules
import React from 'react'
// assets
import KoiIcon from 'img/koi-logo.svg'

// styles
import './index.css'


export default () => {
  return (
    <header className='lock-screen-header'>
      <KoiIcon className='koi-icon' />
      <div className='koi-title'>Koii Wallet</div>
    </header>
  )
}
