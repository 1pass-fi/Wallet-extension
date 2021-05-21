import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import './index.css'

import Card from 'shared/card'
import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import Fish from 'img/fish.svg'
import ShareIconOne from 'img/wallet/share-icon.svg'
import ShareIconTwo from 'img/wallet/share2-icon.svg'
import KeyIcon from 'img/wallet/key-icon.svg'
import DeleteIcon from 'img/wallet/delete-icon.svg'
import RemoveAccountModal from 'shared/modal/removeAccountModal'
import RemoveConnectedSite from 'popup/components/modals/removeConnectedSites'

import { removeWallet, lockWallet } from 'actions/koi'
import { getChromeStorage, deleteOriginFromChrome } from 'utils'
import { STORAGE } from 'constants'


const WalletInfo = ({ accountName, accountAddress, koiBalance, arBalance }) => {
  return (
    <div className='wallet-info'>
      <div className='wallet-info-row'>
        <div>
          <div className='name'>
            <div>{accountName}</div>
            <EditIcon />
          </div>
          <div className='addr'>
            <div>{`${accountAddress.slice(0, 6)}...${accountAddress.slice(accountAddress.length - 4)}`}</div>
            <CopyIcon />
          </div>
        </div>
      </div>
      <div className='wallet-info-row'>
        <div>
          <div className='koi'>{koiBalance} KOI</div>
          <div className='ar'>0.{arBalance.toString().slice(0, 3)} AR</div>
        </div>
      </div>
    </div>
  )
}

const ITEMS = [
  {
    icon: <ShareIconOne />,
    title: 'View Block Explorer',
    onClick: () => { },
    className: ''
  },
  {
    icon: <KeyIcon />,
    title: 'Export Private Key',
    onClick: () => { },
    className: ''
  },
]

const WalletConfItem = ({ icon, title, onClick, className }) => {
  return (
    <div className={'wallet-conf-item ' + className} onClick={onClick}>
      {icon}
      <p>{title}</p>
    </div>
  )
}

const WalletConf = ({ handleRemoveWallet, accountAddress, sites, handleDeleteSite }) => {
  const [showModal, setShowModal] = useState(false)
  const [showModalConnectedSite, setShowModalConnectedSite] = useState(false)
  return (
    <div className='wallet-conf'>
      {ITEMS.map(content => <WalletConfItem {...content} />)}
      <WalletConfItem className='' icon={<ShareIconTwo />} title='See Connected Sites' onClick={() => setShowModalConnectedSite(true)} />
      <WalletConfItem className='delete-wallet' icon={<DeleteIcon />} title='Remove Account' onClick={() => setShowModal(true)} />
      { showModal && (
        <RemoveAccountModal
          accountName="Account 1"
          accountAddress={accountAddress}
          onClose={() => setShowModal(false)}
          onSubmit={handleRemoveWallet}
        />
      )}
      {
        showModalConnectedSite && (
          <RemoveConnectedSite
            sites={sites}
            accountName='Account 1'
            handleDeleteSite={handleDeleteSite}
            onClose={() => setShowModalConnectedSite(false)}
          />
        )
      }
    </div>
  )
}

export const Wallet = ({ accountAddress, koiBalance, arBalance, removeWallet }) => {
  const [connectedSite, setConnectedSite] = useState([])
  const handleRemoveWallet = () => removeWallet()

  const handleDeleteSite = async (site) => {
    await deleteOriginFromChrome(site)
    const connectedSite = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
    setConnectedSite(connectedSite)
  }

  useEffect(() => {
    const getConnectedSite = async () => {
      let connectedSite = (await getChromeStorage(STORAGE.SITE_PERMISSION))[STORAGE.SITE_PERMISSION]
      if (!connectedSite) connectedSite = []
      setConnectedSite(connectedSite)
    }

    getConnectedSite()
  })

  return (
    <div className="wallet">
      <div className='wallet fish'><Fish /></div>
      <div className="wallet-wrapper">
        <WalletInfo accountName={'Account #1'} accountAddress={accountAddress} koiBalance={koiBalance} arBalance={arBalance} />
        <Card className='address'>${accountAddress}</Card>
        <WalletConf
          accountAddress={accountAddress}
          sites={connectedSite}
          handleDeleteSite={handleDeleteSite}
          handleRemoveWallet={handleRemoveWallet}
        />
      </div>
    </div>
  )
}

export default connect(null, { removeWallet, lockWallet })(Wallet)
