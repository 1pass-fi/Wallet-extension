import React from 'react'
import LogoIcon from 'img/koi-logo.svg'
import SettingIcon from 'img/settings-icon.svg'
import NavBar from './navBar'
import './index.css'

export default () => {
  return (
    <>
      <header>
        <LogoIcon className="logo" />
        <button className="gallery-button">My NFT Gallery</button>
        <button className="setting-button">
          <SettingIcon />
        </button>
      </header >
      <NavBar />
    </>
  )
}
