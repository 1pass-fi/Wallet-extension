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

const ExportNFT = ({ info }) => {
  const [isShowEthereum, setIsShowEthereum] = useState(false)

  const [type, setType] = useState(null)
  const { type: _type } = info

  const handleOnClick = (walletType) => {
    setIsShowEthereum(true)
    setType(walletType)
  }

  console.log('info', info)

  return (
    <div className='export-nft container'>
      <div className='export-nft title container'>
        Share to earn Attention Rewards
        <div className='export-nft title description'>
          List your NFT on any exchange or display it in a gallery on any chain,
          without making a duplicate.
        </div>
      </div>
      {_type === TYPE.ARWEAVE && 
      <div className='logo-wrapper' onClick={() => handleOnClick(TYPE.ETHEREUM)}>
        <EthereumLogo className='logo'/>
        <div className='text'>Ethereum</div>
      </div>}
      {_type === TYPE.ETHEREUM &&
      <div className='logo-wrapper' onClick={() => handleOnClick(TYPE.ARWEAVE)}>
        <ArweaveLogo className='logo'/>
        <div className='text'>Arweave</div>
      </div>}

      <div className='coming-soon'>Coming soon:</div>

      <div className='export-nft chains container'>
        <Chain Icon={TezosLogo} title='Tezos' />
        <Chain Icon={PolkadotLogo} title='Polkadot' />
        <Chain Icon={BinanceLogo} title='Binance' />
        <Chain Icon={Avalanche} title='Avalanche' />
      </div>

      {isShowEthereum && (
        <ExportWallet info={info} onClose={() => setIsShowEthereum(false)} type={type}/>
      )}
    </div>
  )
}

export default ({ onClose, info }) => {
  return (
    <div>
      <Modal onClose={onClose}>
        <ExportNFT info={info} />
      </Modal>
    </div>
  )
}
