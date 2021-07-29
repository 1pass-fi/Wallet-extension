import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import getSymbolFromCurrency from 'currency-symbol-map'

import AccountInfo from './AccountInfo'
import './index.css'

import { CopyToClipboard } from 'react-copy-to-clipboard'

import Card from 'shared/card'
import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import ShareIconOne from 'img/wallet/share-icon.svg'
import ShareIconTwo from 'img/wallet/share2-icon.svg'
import KeyIcon from 'img/wallet/key-icon.svg'
import DeleteIcon from 'img/wallet/delete-icon.svg'
import RemoveAccountModal from 'shared/modal/removeAccountModal'
import RemoveConnectedSite from 'popup/components/modals/removeConnectedSites'
import EditAccountNameModal from 'popup/components/modals/editAccountNameModal'

import { removeWallet, getKeyFile } from 'actions/koi'
import { setNotification } from 'actions/notification'
import { setAccountName } from 'actions/accountName'
import { numberFormat, fiatCurrencyFormat, getAccountName, updateAccountName } from 'utils'
import { NOTIFICATION, PATH } from 'koiConstants'
import ExportPrivateKeyModal from './exportPrivateKeyModal'
import { setIsLoading } from 'popup/actions/loading'

import storage from 'storage'
import { TYPE } from 'account/accountConstants'


const WalletConfItem = ({ icon, title, onClick, className }) => {
  return (
    <div className={'wallet-conf-item ' + className} onClick={onClick}>
      {icon}
      <p>{title}</p>
    </div>
  )
}

const WalletConf = (({
  handleRemoveWallet,
  handleGetKeyFile,
  accountAddress,
  accountName,
  sites,
  handleDeleteSite,
  account
}) => {
  const [showModal, setShowModal] = useState(false)
  const [showModalConnectedSite, setShowModalConnectedSite] = useState(false)
  const [showExportKeyModal, setShowExportKeyModel] = useState(false)

  const onExportClick = () => {
    handleGetKeyFile()
  }

  return (
    <div className='wallet-conf'>
      <WalletConfItem
        icon={<ShareIconOne />}
        title={account.type == TYPE.ARWEAVE ? 'View Block Explorer' : 'Etherscan Explorer'}
        onClick={() => {
          const url = `${account.type == TYPE.ARWEAVE ? PATH.VIEW_BLOCK : PATH.ETHERSCAN}/${account.address}`
          chrome.tabs.create({ url })
        }}
      />
      <WalletConfItem
        icon={<KeyIcon />}
        title={'Export Private Key'}
        onClick={() => setShowExportKeyModel(true)}
      />
      <WalletConfItem
        className=''
        icon={<ShareIconTwo />}
        title='See Connected Sites'
        onClick={() => setShowModalConnectedSite(true)}
      />
      <WalletConfItem
        className='delete-wallet'
        icon={<DeleteIcon />}
        title='Remove Account'
        onClick={() => setShowModal(true)}
      />
      {showModal && (
        <RemoveAccountModal
          accountName={account.accountName}
          accountAddress={account.address}
          onClose={() => setShowModal(false)}
          onSubmit={handleRemoveWallet}
        />
      )}
      {showModalConnectedSite && (
        <RemoveConnectedSite
          sites={sites}
          accountName={accountName}
          handleDeleteSite={handleDeleteSite}
          onClose={() => setShowModalConnectedSite(false)}
        />
      )}
      {showExportKeyModal && <ExportPrivateKeyModal address={account.address} setShowExportKeyModel={setShowExportKeyModel}/>}
    </div>
  )
})

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
        <WalletConf
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
