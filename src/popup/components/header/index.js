import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Redirect, withRouter, useHistory } from 'react-router-dom'

import LogoIcon from 'img/koi-logo.svg'
import SettingIcon from 'img/settings-icon.svg'
import NavBar from './navBar'

import { getChromeStorage } from 'utils'
import { STORAGE, NAVBAR_EXCLUDE_PATH } from 'koiConstants'
import { setError } from 'actions/error'

import './index.css'

const Header = ({ location, setError, koi }) => {
  const [showGalleryButton, setShowGalleryButton] = useState(true)

  const history = useHistory()
  /* istanbul ignore next */
  const onGalleryClick = () => {
    const url = chrome.extension.getURL('options.html')
    chrome.tabs.create({ url })
  }

  /* istanbul ignore next */
  const onSettingButtonClick = async () => {
    const address = (await getChromeStorage(STORAGE.KOI_ADDRESS))[
      STORAGE.KOI_ADDRESS
    ]
    if (address) {
      history.push('/setting')
    } else {
      setError('Please Import Wallet or Create new Wallet.')
    }
  }

  const onLogoButtonClick = () => {
    if (koi.address) {
      history.push('/account')
    } else {
      history.push('/account/welcome')
    }
  }

  useEffect(() => {
    const getAddress = async () => {
      const storage = await getChromeStorage(STORAGE.KOI_ADDRESS)
      if (storage[STORAGE.KOI_ADDRESS]) setShowGalleryButton(true)
    }

    getAddress()
  }, [])

  return (
    <>
      <header
        style={{
          marginBottom: location.pathname === '/setting' ? '20px' : '0',
        }}
      >
        <button className='logo-button' onClick={onLogoButtonClick}>
          <LogoIcon className='logo' />
        </button>
        {!NAVBAR_EXCLUDE_PATH.includes(location.pathname) && <button onClick={onGalleryClick} className='gallery-button'>
          My NFT Gallery
        </button>}
        {!NAVBAR_EXCLUDE_PATH.includes(location.pathname) && <button className='setting-button' onClick={onSettingButtonClick}>
          <SettingIcon />
        </button>}
      </header>
      {!NAVBAR_EXCLUDE_PATH.includes(location.pathname) && <NavBar />}
    </>
  )
}

const mapStateToProps = (state) => ({ koi: state.koi })

export default connect(mapStateToProps, { setError })(withRouter(Header))
