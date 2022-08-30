
// modules
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { removeWallet } from 'actions/koi'
// actions
import { setIsLoading } from 'actions/loading'
import { TYPE } from 'constants/accountConstants'
// constants
import { PATH } from 'constants/koiConstants'
import DeleteIcon from 'img/wallet/delete-icon.svg'
import KeyIcon from 'img/wallet/key-icon.svg'
// assets
import ShareIconOne from 'img/wallet/share-icon.svg'
import ShareIconTwo from 'img/wallet/share2-icon.svg'
import RemoveConnectedSite from 'popup/components/modals/removeConnectedSites'
// services
import { popupAccount } from 'services/account'
// components
import RemoveAccountModal from 'shared/modal/removeAccountModal'

import ExportPrivateKeyModal from './exportPrivateKeyModal'

// styles
import './index.css'


const AccountConfItem = ({ icon, title, onClick, className }) => {
  return (
    <div className={'wallet-conf-item ' + className} onClick={onClick}>
      {icon}
      {title}
    </div>
  )
}

const AccountConfig = (({ sites, account, setIsLoading, removeWallet }) => {
  const history = useHistory()

  const [showModal, setShowModal] = useState(false)
  const [showModalConnectedSite, setShowModalConnectedSite] = useState(false)
  const [showExportKeyModal, setShowExportKeyModel] = useState(false)

  const handleRemoveWallet = async () => {
    try {
      setIsLoading(true)
      await removeWallet(account.address, account.type)
      setShowModal(false)
      setIsLoading(false)

      // if remove the last wallet, redirect to welcome screen
      const totalAccount = await popupAccount.count()
      if (totalAccount == 0) history.push(PATH.WELCOME)
    } catch (err) {
      setIsLoading(false)
      console.log(err.message)
    }
  } 

  const handleDeleteSite = async (site) => {
    await storage.generic.method.deleteSite(site)
    const connectedSite = await storage.generic.get.connectedSites() || []
    setConnectedSite(connectedSite)
  }

  return (
    <div className='wallet-conf'>

      <AccountConfItem
        icon={<ShareIconOne />}
        title={account.type == TYPE.ARWEAVE ? 'View Block Explorer' : 'Etherscan Explorer'}
        onClick={() => {
          const url = `${account.type == TYPE.ARWEAVE ? PATH.VIEW_BLOCK : PATH.ETHERSCAN}/${account.address}`
          chrome.tabs.create({ url })
        }}
      />
      {account.type === TYPE.ARWEAVE && <AccountConfItem
        icon={<KeyIcon />}
        title={'Export Private Key'}
        onClick={() => setShowExportKeyModel(true)}
      />}
      {account.type === TYPE.ARWEAVE && <AccountConfItem
        className=''
        icon={<ShareIconTwo />}
        title='See Connected Sites'
        onClick={() => setShowModalConnectedSite(true)}
      />}
      <AccountConfItem
        className='delete-wallet'
        icon={<DeleteIcon />}
        title='Remove Account'
        onClick={() => setShowModal(true)}
      />

      {/* REMOVE ACCOUNT MODAL */}
      {showModal && (
        <RemoveAccountModal
          accountName={account.accountName}
          accountAddress={account.address}
          onClose={() => setShowModal(false)}
          onSubmit={handleRemoveWallet}
        />
      )}

      {/* CONNECTED SITE MODAL */}
      {showModalConnectedSite && (
        <RemoveConnectedSite
          account={account}
          sites={sites}
          accountName={account.accountName}
          handleDeleteSite={handleDeleteSite}
          onClose={() => setShowModalConnectedSite(false)}
        />
      )}
      {/* EXPORT KEYFILE MODAL */}
      {showExportKeyModal && (
        <ExportPrivateKeyModal 
          address={account.address} 
          setShowExportKeyModel={setShowExportKeyModel}
        />
      )}
    </div>
  )
})

export default connect(null, { setIsLoading, removeWallet })(AccountConfig)
