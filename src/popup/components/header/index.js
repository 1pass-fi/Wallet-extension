// modules
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useHistory,withRouter } from 'react-router-dom'
// actions
import { setError } from 'actions/error'
// constants
import { NAVBAR_EXCLUDE_PATH, PATH,STORAGE } from 'constants/koiConstants'
// assets
import LogoIcon from 'img/koi-logo-42-31.svg'
import SettingIcon from 'img/settings-icon.svg'
import { isEmpty } from 'lodash'
// utils
import { getChromeStorage } from 'utils'

// components
import NavBar from './navBar'

// styles
import './index.css'


const Header = ({ location, setError, koi, accounts }) => {
  const [showGalleryButton, setShowGalleryButton] = useState(true)

  const history = useHistory()
  /* istanbul ignore next */
  const onCreateNFTClick = () => {
    const url = chrome.extension.getURL('options.html#/create-nft')
    chrome.tabs.create({ url })
  }

  /* istanbul ignore next */
  const onSettingButtonClick = async () => {
    if (isEmpty(accounts)) {
      setError('Please Import Wallet or Create new Wallet.')
    } else {
      history.push(PATH.SETTING)
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
        {!NAVBAR_EXCLUDE_PATH.includes(location.pathname) && (
          <>
            <div onClick={onCreateNFTClick} className='create-nft-button'>
              Create NFT
            </div>
            <button className='setting-button' onClick={onSettingButtonClick}>
              <SettingIcon /> 
            </button>
          </>
        )}
      </header>
      {!NAVBAR_EXCLUDE_PATH.includes(location.pathname) && <NavBar />}
    </>
  )
}

const mapStateToProps = (state) => ({ koi: state.koi, accounts: state.accounts })

export default connect(mapStateToProps, { setError })(withRouter(Header))
