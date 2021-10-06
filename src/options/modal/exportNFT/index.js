import React, { useState } from 'react'
import Modal from 'options/shared/modal'

import './index.css'

import ArweaveLogo from 'img/arweave-icon.svg'
import EthereumLogo from 'img/chain/ethereum-logo.svg'
import BinanceLogo from 'img/chain/binance-logo.svg'
import Avalanche from 'img/chain/avalanche-logo.svg'
import PolkadotLogo from 'img/chain/polkadot-logo.svg'
import TezosLogo from 'img/chain/tezos-logo.svg'

import ExportWallet from './ExportWallet'

import { TYPE } from 'constants/accountConstants'

const Chain = ({ Icon, title }) => {
  return (
    <div className='export-nft chain container'>
      <div className='export-nft chain icon'>
        <Icon />
      </div>
      <div className='export-nft chain text'>{title}</div>
    </div>
  )
}

const ExportNFT = ({ info, onClose }) => {
  const { type } = info
  const walletType = (type === TYPE.ARWEAVE) ? TYPE.ETHEREUM : TYPE.ARWEAVE

  return (
    <div className='export-nft container'>
      <ExportWallet info={info} type={walletType} onClose={onClose} />
    </div>
  )
}

export default ({ onClose, info }) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <ExportNFT info={info} onClose={onClose} />
      </Modal>
    </div>
  )
}
