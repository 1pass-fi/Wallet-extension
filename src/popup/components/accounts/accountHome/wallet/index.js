import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import AccountInfo from './AccountInfo'
import AccountConfig from './AccountConf'
import './index.css'

import Card from 'shared/card'

import { removeWallet, getKeyFile } from 'actions/koi'
import { setNotification } from 'actions/notification'
import { setAccountName } from 'actions/accountName'
import { setIsLoading } from 'popup/actions/loading'

import storage from 'storage'
import { setError } from 'popup/actions/error'

export const Wallet = ({account}) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={collapsed ? 'wallet collapsed' : 'wallet'}>
      <div className='wallet-wrapper'>
        <AccountInfo account={account} setCollapsed={setCollapsed} collapsed={collapsed}/>
        <Card className='address'>{account.address}</Card>
        <AccountConfig
          accountAddress={'address'}
          sites={[]}
          account={account}
        />
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  koi: state.koi,
  price: state.price,
  accountName: state.accountName,
  currency: state.currency,
  ethereum: state.ethereum
})

export default connect(mapStateToProps, {
  removeWallet,
  getKeyFile,
  setNotification,
  setAccountName,
  setIsLoading
})(Wallet)
