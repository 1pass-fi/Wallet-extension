import React, { useContext } from 'react'
import { useLocation } from 'react-router'
import { find } from 'lodash'

import KoiIcon from 'img/finnie-koi-logo-white.svg'
import ArUnit from 'img/ar-token.svg'
import KoiUnit from 'img/koi-token.svg'
import SearchBar from './SearchBar'

import { formatNumber } from '../../utils'

import './index.css'
import { GalleryContext } from 'options/galleryContext'

export default ({ totalKoi, totalAr, headerRef }) => {
  const { wallets, setAccount } = useContext(GalleryContext)
  const { pathname } = useLocation()

  const onChangeAccountSelect = (e) => {
    const accountAddress = e.target.value
    const selectedAccount = find(wallets, v => v.address == accountAddress)
    setAccount(selectedAccount)
  }

  return (
    <header className='app-header' ref={headerRef}>
      <div className='header-left'>
        <KoiIcon className='logo' />
      </div>
      {/* <div className='account-select'>
        <select
          onChange={onChangeAccountSelect}
        >
          {wallets.map(wallet => <option>{wallet.address}</option>)}
        </select>
      </div> */}
      <div className='header-center'>{pathname == '/' && <SearchBar />}</div>
      <div className='header-right'>
        <div className='total-koi'>
          <KoiUnit className='koi-unit' />
          <div>{formatNumber(totalKoi)}</div>
          <ArUnit className='ar-unit' />
          <div>{formatNumber(totalAr, 6)}</div>
        </div>
        {!totalKoi && 
          <a
            target='_blank'
            href='https://koi.rocks/faucet?step=0'
            className='no-koi'
          >
            <div className='get-some'>No KOII? <u>Get some</u></div>
          </a> 
        }
      </div>
    </header>
  )
}
