import React from 'react'
import { Redirect, withRouter, useHistory } from 'react-router-dom'
import LogoIcon from 'img/koi-logo.svg'
import SettingIcon from 'img/settings-icon.svg'
import NavBar from './navBar'
import './index.css'

const Header = ({ location }) => {
  const history = useHistory()
  const onGalleryClick = () => {
    const url = chrome.extension.getURL('options.html')
    chrome.tabs.create({ url })
  }

  const onSettingButtonClick = () => {
    history.push('/setting')
  }

  const onLogoButtonClick = () => {
    history.push('/account')
  }

  return (
    <>
      <header style={{marginBottom: location.pathname === '/setting'? '20px': '0'}}>
        <button className='logo-button' onClick={onLogoButtonClick}>
          <LogoIcon className='logo' />
        </button>
        <button onClick={onGalleryClick} className='gallery-button'>
          My NFT Gallery
        </button>
        <button className='setting-button' onClick={onSettingButtonClick}>
          <SettingIcon />
        </button>
      </header>
      { location.pathname !== '/setting' && <NavBar /> }
    </>
  )
}

export default withRouter(Header)
