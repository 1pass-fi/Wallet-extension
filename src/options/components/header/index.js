import React from 'react'
import { useLocation } from 'react-router'

import KoiIcon from 'img/finnie-koi-logo-white.svg'
import ArUnit from 'img/ar-token.svg'
import KoiUnit from 'img/koi-token.svg'
import SearchBar from './SearchBar'

import { formatNumber } from '../../utils'

import './index.css'

export default ({ totalKoi, totalAr, headerRef }) => {
  const { pathname } = useLocation()

  return (
    <header className='app-header' ref={headerRef}>
      <div className='header-left'>
        <KoiIcon className='logo' />
      </div>
      <div className='header-center'>{pathname == '/' && <SearchBar />}</div>
      <div className='header-right'>
        {totalKoi ? (
          <div className='total-koi'>
            <KoiUnit className='koi-unit' />
            <div>{formatNumber(totalKoi)}</div>
            <ArUnit className='ar-unit' />
            <div>{totalAr}</div>
          </div>
        ) : (
          <a
            target='_blank'
            href='https://koi.rocks/faucet?step=0'
            className='no-koi'
          >
            <div className='get-some'>No KOI? Get some</div>
          </a>
        )}
      </div>
    </header>
  )
}
