import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import KoiIcon from 'img/finnie-koi-logo-white.svg'
import ArUnit from 'img/ar-token.svg'
import KoiUnit from 'img/koi-token.svg'
import EthereumUnit from 'img/ethereum-logo.svg'
import ReloadIcon from 'img/refresh-balance-icon.svg'
import DidProfilePicture from 'img/did-profile-picture.svg'

import SearchBar from './SearchBar'
import Loading from 'options/components/loading'

import { formatNumber } from '../../utils'

import './index.css'
import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'

import { popupBackgroundConnect } from 'services/request/popup'

import ReactTooltip from 'react-tooltip'

export default ({
  headerRef,
  isLoading,
}) => {
  const { pathname } = useLocation()

  const { setShowProfilePictureModal, profilePictureId } = useContext(GalleryContext)
  
  const defaultAccount = useSelector(state => state.defaultAccount)
  const { balance, koiBalance } = defaultAccount

  const handleLoadBalances = () => {
    popupBackgroundConnect.postMessage({
      type: MESSAGES.GET_BALANCES,
    })
  }

  return (
    <header className='app-header' ref={headerRef}>
      <div className='header-left'>
        {/* <Link to='/'>
          <KoiIcon className='logo' />
        </Link> */}
      </div>
      <div className='header-center'>{pathname == '/' && <SearchBar />}</div>
      <div className='header-right'>
        <div>
          {isLoading && <Loading />}
        </div>
        <div className='header-right-balances'>
          <div className='koi-info'>
            <div className='total-koi'>
              {defaultAccount.type === TYPE.ARWEAVE && (
              <>
                <KoiUnit className='koi-unit' />
                <div>{formatNumber(koiBalance)}</div>
              </>
              )}
              {defaultAccount.type === TYPE.ARWEAVE ? (
              <>
                <ArUnit className='koi-unit ar' />
                <div>{formatNumber(balance, 6)}</div>
              </>
              ) : (
              <>
                <EthereumUnit className='koi-unit' />
                <div>{formatNumber(balance, 6)}</div>
              </>
              )}

            </div>
            <div data-tip='Refresh Balance' className='reload-icon'>
              <ReloadIcon onClick={handleLoadBalances}  />
            </div>
            <div onClick={() => setShowProfilePictureModal(prev => !prev)} className='kid-profile-picture'>
              {!profilePictureId ? <DidProfilePicture /> : 
                <img src={`https://arweave.net/${profilePictureId}`}/>
              }
            </div>
          </div>
          {!koiBalance && !!(defaultAccount.type == TYPE.ARWEAVE) && (
            <a
              target='_blank'
              href='https://koi.rocks/faucet?step=0'
              className='no-koi'
            >
              <div className='get-some'>
                No KOII? <u>Get some</u>
              </div>
            </a>
          )}
        </div>

        <ReactTooltip place='top' type="dark" effect="float"/>
      </div>
    </header>
  )
}
