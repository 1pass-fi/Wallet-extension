import React from 'react'

import KoiIcon from 'img/koi-logo.svg'
import KoiUnit from 'img/koi-logo-no-bg.svg'
import SettingsIcon from 'img/settings-icon.svg'

import { formatNumber } from '../../utils'

import './index.css'

export default ({ totalKoi, headerRef }) => {
  return (
    <header className='app-header' ref={headerRef}>
      <div className='header-left'>
        <KoiIcon className='logo' />
      </div>
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
        <button className='setting-button'>
          <SettingsIcon className='option setting-icon'></SettingsIcon>
        </button>
      </div>
    </header>
  )
}
