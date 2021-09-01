import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { find } from 'lodash'

import KoiIcon from 'img/finnie-koi-logo-white.svg'
import ArUnit from 'img/ar-token.svg'
import KoiUnit from 'img/koi-token.svg'
import EthereumUnit from 'img/ethereum-logo.svg'
import ReloadIcon from 'img/reload-icon.svg'

import SearchBar from './SearchBar'
import Loading from 'options/components/loading'
import WaitingAddNFTMessage from './WaitingAddNFTMessage'

import { formatNumber } from '../../utils'

import './index.css'
import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'

import { popupBackgroundConnect } from 'services/request'

export default ({
  totalKoi,
  totalAr,
  headerRef,
  isLoading,
  isWaitingAddNFT,
  setIsWaitingAddNFT,
}) => {
  const { pathname } = useLocation()
  const { account } = useContext(GalleryContext)

  const handleLoadBalances = () => {
    popupBackgroundConnect.postMessage({
      type: MESSAGES.GET_BALANCES,
    })
  }

  return (
    <header className='app-header' ref={headerRef}>
      <div className='header-left'>
        <KoiIcon className='logo' />
      </div>
      <div className='header-center'>{pathname == '/' && <SearchBar />}</div>
      <div className='header-right'>
        {isLoading && isWaitingAddNFT && (
          <WaitingAddNFTMessage onClose={() => setIsWaitingAddNFT(false)} />
        )}
        {isLoading && <Loading />}
        <div className='koi-info'>
          <div className='total-koi'>
            {account.type === TYPE.ARWEAVE && (
              <>
                <KoiUnit className='koi-unit' />
                <div>{formatNumber(totalKoi)}</div>
              </>
            )}
            {account.type === TYPE.ARWEAVE ? (
              <>
                <ArUnit className='koi-unit ar' />
                <div>{formatNumber(totalAr, 6)}</div>
              </>
            ) : (
              <>
                <EthereumUnit className='koi-unit' />
                <div>{formatNumber(totalAr, 6)}</div>
              </>
            )}
            <ReloadIcon onClick={handleLoadBalances} className='reload-icon' />
          </div>
          {!totalKoi && !!(account.type == TYPE.ARWEAVE) && (
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
      </div>
    </header>
  )
}
