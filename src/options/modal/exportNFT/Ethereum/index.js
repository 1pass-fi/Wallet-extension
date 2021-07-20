import React, { useState } from 'react'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import EthereumLogo from 'img/ethereum-logo-18.svg'
import StackIcon from 'img/stack-icon.svg'

import './index.css'

const STEPS_CONTENT = [
  'Deposit NFT to lock it in vault contract',
  'Mint ETH NFT',
  'Send NFT to ETH wallet',
]

export default ({ info, onClose }) => {
  const [address, setAddress] = useState('')
  const [numberTransfer, setNumberTransfer] = useState('0')

  const { name, earnedKoi, totalViews, imageUrl } = info

  const onAddressChange = (e) => {
    // handle input and dropdown
    setAddress(e.target.value)
  }

  const onNumberTransferChange = (e) => {
    setNumberTransfer(e.target.value)
  }

  const onSubmit = () => {
    // TODO: Handle submit
    console.log(address)
    console.log(numberTransfer)
  }

  return (
    <div className='transfer-wallet-modal-wrapper'>
      <div className='transfer-wallet-modal'>
        <div className='title'>Transfer your media to an Ethereum wallet.</div>
        <div className='description'>
          This process takes usually around 10-15 minutes. With one click, the
          Koii contract will complete the process below.&nbsp;
          <a href='#' className='link'>
            Learn more
          </a>
          .
        </div>

        <div className='steps'>
          {STEPS_CONTENT.map((step, index) => (
            <div className='step' key={step}>
              <div className='number'>{index + 1}</div>
              <div className='text'>{step}</div>
            </div>
          ))}
        </div>

        <div className='content'>
          <div className='left'>
            <img
              className='nft-url'
              src={
                imageUrl ||
                'https://static.remove.bg/remove-bg-web/3661dd45c31a4ff23941855a7e4cedbbf6973643/assets/start_remove-79a4598a05a77ca999df1dcb434160994b6fde2c3e9101984fb1be0f16d0a74e.png'
              }
            />
            <div className='name'>{name || 'Herry Kean'}</div>
            <div className='views'>{totalViews || '123'} views</div>
            <div className='earned-koi'>
              {earnedKoi || '12312312'} KOII earned
            </div>
          </div>

          <div className='right'>
            <div className='eth-address'>
              <label className='label'>ETH Address</label>
              <EthereumLogo className='input-logo' />
              <input
                value={address}
                onChange={onAddressChange}
                className='input'
                placeholder='select from connected wallets or enter a new address'
              />
            </div>

            <div className='number-to-transfer'>
              <div className='total-available'>total available: 12</div>
              <label className='label'>Number to transfer:</label>
              <StackIcon className='input-logo' />
              <input
                value={numberTransfer}
                onChange={onNumberTransferChange}
                className='input'
              />
              <div className='description'>
                Many NFTs will only have 1 item minted. If this is the case for
                your transfer, this box will auto-fill.
              </div>
            </div>

            <div className='estimate-cost'>
              <div className='text'>Estimated costs:</div>
              <div className='number'>
                <div className='koi-number'>415.29 KOII</div>
                <div className='ar-number'>0.00014 AR</div>
              </div>
            </div>

            <div className='transfer-button' onClick={onSubmit}>
              One-Click Transfer to ETH
            </div>
          </div>
        </div>

        <div className='close-button' onClick={onClose}>
          <CloseIcon />
        </div>

        <div className='goback-button' onClick={onClose}>
          <GoBackIcon />
        </div>
      </div>
    </div>
  )
}
