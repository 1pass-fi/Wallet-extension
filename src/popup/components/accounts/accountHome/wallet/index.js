import React from 'react'
import { useHistory } from 'react-router-dom'
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

import { removeWallet, lockWallet } from 'actions/koi'


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
          <div className='ar'>{arBalance} AR</div>
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
  {
    icon: <ShareIconTwo />,
    title: 'See Connected Sites',
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

const WalletConf = ({ handleRemoveWallet }) => {
  return (
    <div className='wallet-conf'>
      {ITEMS.map(content => <WalletConfItem {...content} />)}
      <WalletConfItem className='delete-wallet' icon={<DeleteIcon />} title='Remove Account' onClick={handleRemoveWallet} />
    </div>
  )
}

export const Wallet = ({ accountAddress, koiBalance, arBalance, removeWallet, lockWallet }) => {
  const history = useHistory()
  const handleRemoveWallet = () => removeWallet()

  const handleLockWallet = () => lockWallet({ history })

  return (
    <div className="wallet">
      <Fish className='fish' />
      <div className="wallet-wrapper">
        <WalletInfo accountName={'Account #1'} accountAddress={accountAddress} koiBalance={koiBalance} arBalance={arBalance} />
        <Card className='address'>${accountAddress}</Card>
        <WalletConf handleRemoveWallet={handleRemoveWallet} />
        <button className='lock-button' onClick={handleLockWallet}>Lock</button>
      </div>
    </div>
  )
}

export default connect(null, { removeWallet, lockWallet })(Wallet)
