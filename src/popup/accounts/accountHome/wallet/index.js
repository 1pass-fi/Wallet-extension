import React from 'react'

import './index.css'
import Card from 'shared/card'
import CopyIcon from 'img/copy-icon.svg'
import EditIcon from 'img/edit-icon.svg'
import Fish from 'img/fish.svg'

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
            <div>{`${accountAddress.slice(0, 6)}...${accountAddress.slice(accountAddress.length - 6)}`}</div>
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
    icon: 'icon',
    title: 'title',
    onClick: () => { }
  }
]

const WalletConfItem = ({ icon, title, onClick }) => {
  return (
    <div onClick={onClick}>
      {icon}
      <p>{title}</p>
    </div>
  )
}

const WalletConf = () => {
  return (
    <div className='wallet-conf'>
      {ITEMS.map(content => <WalletConfItem {...content} />)}
    </div>
  )
}

export default ({ accountAddress, koiBalance, arBalance }) => {
  return (
    <div className="wallet">
      <Fish className='fish' />
      <div className="wallet-wrapper">
        <WalletInfo accountName={'Account #1'} accountAddress={accountAddress} koiBalance={koiBalance} arBalance={arBalance} />
        <Card className='address'>${accountAddress}</Card>
        {/* <WalletConf /> */}
      </div>
    </div>
  )
}
