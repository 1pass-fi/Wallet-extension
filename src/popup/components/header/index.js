import React from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter, useHistory } from 'react-router-dom'

import LogoIcon from 'img/koi-logo.svg'
import SettingIcon from 'img/settings-icon.svg'
import NavBar from './navBar'

import { getChromeStorage } from 'utils'
import { STORAGE } from 'constants'
import { setError } from 'actions/error'

import './index.css'

const Header = ({ location, setError }) => {
  const history = useHistory()
  /* istanbul ignore next */
  const onGalleryClick = () => {
    const url = chrome.extension.getURL('options.html')
    chrome.tabs.create({ url })
  }

  /* istanbul ignore next */
  const onSettingButtonClick = async () => {
    const address = (await getChromeStorage(STORAGE.KOI_ADDRESS))[STORAGE.KOI_ADDRESS]
    if (address) {
      history.push('/setting')
    } else {
      setError('Please Import Wallet or Create new Wallet.')
    }
  }

  const onLogoButtonClick = () => {
    history.push('/account')
  }

  return (
    <>
      <header style={{ marginBottom: location.pathname === '/setting' ? '20px' : '0' }}>
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
      { location.pathname !== '/setting' && <NavBar />}
    </>
  )
}

export default connect(null, { setError })(withRouter(Header))
