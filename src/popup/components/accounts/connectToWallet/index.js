import React, { useState } from 'react'
import union from 'lodash/union'
import filter from 'lodash/filter'
import map from 'lodash/map'

import Card from 'popup/components/shared/card'

import AllowPermission from './allowPermission'
import SelectWallet from './selectWallet'

import KoiIcon from 'img/koi-logo.svg'
import ArweaveIcon from 'img/arweave-icon.svg'

import './index.css'

const walletIcon = {
  koi: <KoiIcon className='wallet-icon' />,
  arweave: <ArweaveIcon className='wallet-icon' />,
}


export default () => {
  const [checkedList, setCheckedList] = useState([])
  const url = 'https://www.google.com/'
  const accounts = [
    {
      name: 'Account 1',
      address: '1234567890123456789012345678901234567890123',
      type: 'arweave',
    },
    // {
    //   name: 'Account 2',
    //   address: '5678901234567890123456789012345678901234456',
    //   type: 'koi',
    // },
    // {
    //   name: 'Account 3',
    //   address: '9999901234567890123456789012345678901234456',
    //   type: 'koi',
    // },
  ]

  const clearChecked = () => {
    setCheckedList([])
  }

  const checkAll = () => {
    setCheckedList(map(accounts, (account) => account.address))
  }

  const onChecked = (e, address) => {
    if (e.target.checked) {
      setCheckedList(union(checkedList, [address]))
    } else {
      setCheckedList(
        filter(checkedList, (checkedAddress) => checkedAddress !== address)
      )
    }
  }

  return (
    <div className='select-wallet'>
      <header className='header'>
        <img src='#' className='logo' />
        <div className='connect-with-koi'>Connect with Koi</div>
        <a className='company-url' target='_blank' href={url}>
          {url}
        </a>
      </header>
      <div className='content'>
        <Card className='card-content'>
          {/* <SelectWallet
            accounts={accounts}
            clearChecked={clearChecked}
            checkAll={checkAll}
            onChecked={onChecked}
            checkedList={checkedList}
          /> */}
          <AllowPermission />
        </Card>
      </div>
    </div>
  )
}
