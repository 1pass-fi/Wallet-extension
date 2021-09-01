// modules
import React from 'react'

// assets
import EthereumLogo from 'img/walletTypeSelection/ethereum-logo.svg'
import KoiIcon from 'img/walletTypeSelection/finnie-koi-logo.svg'
import BinanceLogo from 'img/chain/binance-logo.svg'
import PolkadotLogo from 'img/chain/polkadot-logo.svg'
import AvalancheLogo from 'img/chain/avalanche-logo.svg'
import TezosLogo from 'img/chain/tezos-logo.svg'

// constants
import { TYPE } from 'constants/accountConstants'

// components
import Card from 'shared/card'

// styles
import './index.css'


export default ({ triggerPopup, popupPath }) => {
  const handleOnClick = (walletType) => {
    triggerPopup(`${popupPath}&type=${walletType}`)
  }

  return (
    <Card className='wallet-type-selection'>
      <div className='title'>What type of wallet do you want to import?</div>
      <div className='type-option' onClick={() => handleOnClick(TYPE.ARWEAVE)}>
        <KoiIcon />
        <div className='type-info'>
          <div className='type-text'>Koii Wallet</div>
          <div className='type-text-extra'>(Arweave)</div>
        </div>
      </div>
      <div className='type-option' onClick={() => handleOnClick(TYPE.ETHEREUM)}>
        <EthereumLogo />
        <div className='type-info'>
          <div className='type-text'>Ethereum Wallet</div>
        </div>
      </div>
      <div className='coming-soon'>
        <div className='text'>Coming soon</div>
        <div className='logos'>
          <BinanceLogo />
          <AvalancheLogo />
          <TezosLogo />
          <PolkadotLogo />
        </div>
      </div>
    </Card>
  )
}
