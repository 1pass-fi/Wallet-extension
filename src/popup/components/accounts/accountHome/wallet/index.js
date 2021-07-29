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
import { getAccountName, updateAccountName } from 'utils'
import { setIsLoading } from 'popup/actions/loading'

import storage from 'storage'

export const Wallet = ({
  removeWallet,
  setAccountName,
  setIsLoading,
  account
}) => {
  const history = useHistory()
  const [connectedSite, setConnectedSite] = useState([])
  const [collapsed, setCollapsed] = useState(true)

  const handleRemoveWallet = async () => {
    setIsLoading(true)
    await removeWallet(account.address, account.type)
    setIsLoading(false)
  } 

  const handleDeleteSite = async (site) => {
    await storage.generic.method.deleteSite(site)
    const connectedSite = await storage.generic.get.connectedSites() || []
    setConnectedSite(connectedSite)
  }

  useEffect(() => {
    const getConnectedSite = async () => {
      const connectedSite = await storage.generic.get.connectedSites() || []
      setConnectedSite(connectedSite)
    }

    const getName = async () => {
      let name = await getAccountName()
      if (!name) name = await updateAccountName('Account 1')
      setAccountName(name)
    }
    
    getName()
    getConnectedSite()
  }, [])

  return (
    <div className={collapsed ? 'wallet collapsed' : 'wallet'}>
      <div className='wallet-wrapper'>
        <AccountInfo account={account} setCollapsed={setCollapsed} collapsed={collapsed}/>
        <Card className='address'>{account.address}</Card>
        <AccountConfig
          accountAddress={'address'}
          sites={connectedSite}
          handleDeleteSite={handleDeleteSite}
          handleRemoveWallet={handleRemoveWallet}
          accountName={account.accountName}
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
