import React, { useRef, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import EthereumLogo from 'img/ethereum-logo-18.svg'
import StackIcon from 'img/stack-icon.svg'
import StackWhiteIcon from 'img/stack-white-icon.svg'
import WarningIcon from 'img/dangerous-logo.svg'
import FinnieIcon from 'img/finnie-koi-logo-blue.svg'

import { formatNumber, getDisplayAddress } from 'options/utils'

import './index.css'

const STEPS_CONTENT = [
  'Deposit NFT to lock it in vault contract',
  'Mint ETH NFT',
  'Send NFT to ETH wallet',
]

const TRANSFER_STEPS = {
  INPUT_INFO: 1,
  CONFIRM: 2,
  SUCCESS: 3,
}

const TITLES = {
  1: <div className='title'>Transfer your media to an Ethereum wallet.</div>,
  2: <div className='title'>Confirm Transfer</div>,
  3: <div className='title'>Your NFT is heading to Ethereum!</div>,
}

const DESCRIPTIONS = {
  1: (
    <div className='description'>
      This process takes usually around 10-15 minutes. With one click, the Koii
      contract will complete the process below.&nbsp;
      <a href='#' className='link'>
        Learn more
      </a>
      .
    </div>
  ),
  2: (
    <div className='description'>
      This process takes usually around 10-15 minutes. With one click, the Koii
      contract will complete the process below.&nbsp;
      <a href='#' className='link'>
        Learn more
      </a>
      .
    </div>
  ),
  3: (
    <div className='description'>
      Keep in mind that this process takes usually around 10-15 minutes and can
      take longer, depending on current Ethereum traffic.
    </div>
  ),
}

const AddressDropdown = ({ accounts = [], onChange }) => {
  return (
    <div className='accounts'>
      {accounts.map((account) => (
        <div
          key={account.id}
          className='account'
          onClick={() => onChange(account)}
        >
          <EthereumLogo />
          <div className='info'>
            <div className='name'>{account.name}</div>
            <div className='address'>{getDisplayAddress(account.address)}</div>
          </div>
        </div>
      ))}
      <div className='different-address' onClick={() => onChange({})}>
        <div className='name'>Enter a different address...</div>
      </div>
    </div>
  )
}

export default ({ info, onClose }) => {
  const [address, setAddress] = useState('')
  const [numberTransfer, setNumberTransfer] = useState(1)
  const [isShowDropdown, setIsShowDropdown] = useState(false)
  const [chosenAccount, setChosenAccount] = useState({})
  const [step, setStep] = useState(1)
  const addressInputRef = useRef()
  const accounts = [
    {
      id: '1',
      name: 'Account 1',
      address: '0x1234567891234567891234567891234567',
    },
    {
      id: '2',
      name: 'Account 2',
      address: '22222220x123456789123456789123456789',
    },
  ]
  const totalTransfer = 12

  const { name, earnedKoi, totalViews, imageUrl } = info

  const onAddressInputChange = (e) => {
    // handle input and dropdown
    setAddress(e.target.value)
    setChosenAccount({ address: e.target.value })
  }

  const onAddressDropdownChange = (account) => {
    if (isEmpty(account)) {
      setAddress('')
      addressInputRef.current.focus()
    } else {
      setAddress(account.address)
      setChosenAccount(account)
    }

    setIsShowDropdown(false)
  }

  const onNumberTransferChange = (e) => {
    const number = e.target.value
    if (number > totalTransfer) {
      setNumberTransfer(totalTransfer)
    } else {
      setNumberTransfer(number)
    }
  }

  const onOneClick = () => {
    // TODO: Verify file chosenAccount / chosenAccount.dddress
    console.log({ chosenAccount })
    setStep(step + 1)
  }

  const onConfirm = () => {
    // TODO: Handle submit
    console.log('confirm')
    setStep(step + 1)
  }

  const onSeeActivity = () => {
    // TODO
  }

  const onGoBack = () => {
    console.log(step)
    if (step == TRANSFER_STEPS.INPUT_INFO) {
      onClose()
    } else {
      setStep(step - 1)
    }
  }

  return (
    <div className='transfer-wallet-modal-wrapper'>
      <div className='transfer-wallet-modal'>
        {TITLES[step]}
        {DESCRIPTIONS[step]}

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
            <img className='nft-url' src={imageUrl} />
            <div className='name'>{name}</div>
            <div className='views'>{totalViews} views</div>
            <div className='earned-koi'>
              <FinnieIcon />
              {formatNumber(earnedKoi)} KOII earned
            </div>
          </div>

          <div className='right'>
            {step == TRANSFER_STEPS.INPUT_INFO && (
              <>
                <div className='eth-address'>
                  <label className='label'>ETH Address</label>
                  <EthereumLogo className='input-logo' />
                  <input
                    ref={(ip) => (addressInputRef.current = ip)}
                    value={address}
                    onChange={onAddressInputChange}
                    className='input'
                    placeholder='select from connected wallets or enter a new address'
                  />
                  <div className='address-dropdown'>
                    <div
                      className='dropdown-button'
                      onClick={() => setIsShowDropdown(true)}
                    ></div>
                    {isShowDropdown && (
                      <AddressDropdown
                        accounts={accounts}
                        onChange={onAddressDropdownChange}
                      />
                    )}
                  </div>
                </div>
                <div className='number-to-transfer'>
                  <div className='total-available'>
                    total available:&nbsp; {totalTransfer}
                  </div>
                  <label className='label'>Number to transfer:</label>
                  <StackIcon className='input-logo' />
                  <input
                    type='number'
                    min={1}
                    step={1}
                    max={totalTransfer}
                    value={numberTransfer}
                    onChange={onNumberTransferChange}
                    className='input'
                  />
                  <div className='description'>
                    Many NFTs will only have 1 item minted. If this is the case
                    for your transfer, this box will auto-fill.
                  </div>
                </div>
              </>
            )}

            {step == TRANSFER_STEPS.CONFIRM && (
              <>
                <div className='send-to'>
                  <div className='label'>Sending to:</div>
                  <div className='account'>
                    <EthereumLogo className='account-logo' />
                    <div className='info'>
                      {chosenAccount.name && (
                        <div className='name'>{chosenAccount.name}</div>
                      )}
                      <div className='address'>{chosenAccount.address}</div>
                    </div>
                  </div>
                </div>

                <div className='warning'>
                  <WarningIcon className='warning-icon' />
                  <div className='warning-text'>
                    Make sure this is the correct address. Once sent, there is
                    no way to undo the transaction.
                  </div>
                </div>

                <div className='number-to-transfer confirm'>
                  <div className='total-available'>
                    total available:&nbsp; {totalTransfer}
                  </div>
                  <StackWhiteIcon className='logo' />
                  <div>
                    <span>Transfer</span> {numberTransfer} Edition
                  </div>
                </div>
              </>
            )}

            {step == TRANSFER_STEPS.SUCCESS && (
              <>
                <div className='number-to-transfer success'>
                  <div> {numberTransfer} Edition</div>
                </div>

                <div className='send-to'>
                  <div className='account'>
                    <div className='info'>
                      {chosenAccount.name && (
                        <div className='name'>{chosenAccount.name}</div>
                      )}
                      <div className='address'>{chosenAccount.address}</div>
                    </div>
                  </div>
                </div>

                <div className='transaction-pending'>transaction pending</div>

                <div className='complete-tip'>
                  When complete, transactions will appear in the Activity tab in
                  the dropdown
                </div>
              </>
            )}

            {step != TRANSFER_STEPS.SUCCESS && (
              <div className='estimate-cost'>
                <div className='text'>Estimated costs:</div>
                <div className='number'>
                  <div className='koi-number'>415.29 KOII</div>
                  <div className='ar-number'>0.00014 AR</div>
                </div>
              </div>
            )}

            {step == TRANSFER_STEPS.INPUT_INFO && (
              <div className='transfer-button' onClick={onOneClick}>
                One-Click Transfer to ETH
              </div>
            )}

            {step == TRANSFER_STEPS.CONFIRM && (
              <div className='transfer-button' onClick={onConfirm}>
                Confirm Transfer to ETH
              </div>
            )}

            {step == TRANSFER_STEPS.SUCCESS && (
              <div className='transfer-button success' onClick={onSeeActivity}>
                See My Activity
              </div>
            )}
          </div>
        </div>

        <div className='close-button' onClick={onOneClick}>
          <CloseIcon />
        </div>

        <div className='goback-button' onClick={onGoBack}>
          <GoBackIcon />
        </div>
      </div>
    </div>
  )
}
