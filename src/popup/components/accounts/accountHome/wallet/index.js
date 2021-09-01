// modules
import React, { useState } from 'react'
import { connect } from 'react-redux'

// components
import AccountInfo from './AccountInfo'
import AccountConfig from './AccountConf'
import Card from 'shared/card'

// actions
import { removeWallet, getKeyFile } from 'actions/koi'
import { setNotification } from 'actions/notification'
import { setAccountName } from 'actions/accountName'
import { setIsLoading } from 'popup/actions/loading'

// styles
import './index.css'

export const Wallet = ({ account }) => {
  const [collapsed, setCollapsed] = useState(true)

  return (
    <div className={`wallet ${collapsed ? 'collapsed': ''}`}>
      <div className='wallet-wrapper'>
        <AccountInfo
          account={account}
          setCollapsed={setCollapsed}
          collapsed={collapsed}
        />
        {!collapsed && (
          <>
            <Card className='address'>{account.address}</Card>
            <AccountConfig
              accountAddress={'address'}
              sites={[]}
              account={account}
            />
          </>
        )}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({
  koi: state.koi,
  price: state.price,
  accountName: state.accountName,
  currency: state.currency,
  ethereum: state.ethereum,
})

export default connect(mapStateToProps, {
  removeWallet,
  getKeyFile,
  setNotification,
  setAccountName,
  setIsLoading,
})(Wallet)
