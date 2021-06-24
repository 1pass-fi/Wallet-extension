import React from 'react'
import { useLocation } from 'react-router'

import KoiIcon from 'img/finnie-koi-logo-white.svg'
import KoiUnit from 'img/koi-logo-no-bg.svg'
import SearchBar from './SearchBar'

import { formatNumber } from '../../utils'

import './index.css'

export default ({ totalKoi, headerRef }) => {
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
            <div>{formatNumber(totalKoi)}</div>
            <KoiUnit className='koi-unit' />
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
