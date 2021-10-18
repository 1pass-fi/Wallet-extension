import React, { useContext, useRef, useState, useMemo } from 'react'
import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import ReactTooltip from 'react-tooltip'

import CloseIcon from 'img/close-x-icon.svg'
import GoBackIcon from 'img/goback-icon.svg'
import ArweaveLogo from 'img/arweave-icon.svg'
import EthereumLogo from 'img/ethereum-logo-18.svg'
import StackIcon from 'img/stack-icon.svg'
import StackWhiteIcon from 'img/stack-white-icon.svg'
import WarningIcon from 'img/dangerous-logo.svg'
import FinnieIcon from 'img/finnie-koi-logo-blue.svg'

import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'

import { formatNumber, getDisplayAddress } from 'options/utils'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'

import './index.css'
import { popupAccount } from 'services/account'
import { ERROR_MESSAGE } from 'constants/koiConstants'

const TRANSFER_STEPS = {
  INPUT_INFO: 1,
  CONFIRM: 2,
  SUCCESS: 3,
}

const TITLES_ETH = {
  1: <div className='title'>Transfer your media to an Ethereum wallet.</div>,
  2: <div className='title'>Confirm Transfer</div>,
  3: <div className='title'>Your NFT is heading to Ethereum!</div>,
}

const TITLES_AR = {
  1: <div className='title'>Transfer your media to an Arweave wallet.</div>,
  2: <div className='title'>Confirm Transfer</div>,
  3: <div className='title'>Your NFT is heading to Arweave!</div>,
}

const DESCRIPTIONS_ETH = {
  1: (
    <div className='description'>
      This process takes usually around 10-15 minutes. With one click, the Koii
      contract will move your NFT to Ethereum.&nbsp;
      <a href='#' className='link'>
        Learn more
      </a>
      .
    </div>
  ),
  2: (
    <div className='description'>
      This process takes usually around 10-15 minutes. With one click, the Koii
      contract will move your NFT to Ethereum.&nbsp;
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

const DESCRIPTIONS_AR = {
  1: (
    <div className='description'>
      This process takes usually around 10-15 minutes. With one click, the Koii
      contract will move your NFT to Arweave.&nbsp;
      <a href='#' className='link'>
        Learn more
      </a>
      .
    </div>
  ),
  2: (
    <div className='description'>
      This process takes usually around 10-15 minutes. With one click, the Koii
      contract will move your NFT to Arweave.&nbsp;
      <a href='#' className='link'>
        Learn more
      </a>
      .
    </div>
  ),
  3: (
    <div className='description'>
      Keep in mind that this process takes usually around 10-15 minutes and can
      take longer, depending on current Arweave traffic.
    </div>
  ),
}

const AddressDropdown = ({ accounts = [], onChange, type }) => {
  return (
    <div className='accounts'>
      {accounts.map((account) => {
        if (account.type == type) {
          return (
            <div
              key={account.address}
              className='account'
              onClick={() => onChange(account)}
            >
              <div className='logo'>
                {account.type === TYPE.ARWEAVE && <ArweaveLogo />}
                {account.type === TYPE.ETHEREUM && <EthereumLogo />}
              </div>
              <div className='info'>
                <div className='name'>{account.accountName}</div>
                <div className='address'>{getDisplayAddress(account.address)}</div>
              </div>
            </div>
          )
        }
      })}
      <div className='different-address' onClick={() => onChange({})}>
        <div className='name'>Enter a different address...</div>
      </div>
    </div>
  )
}

export default ({ info, onClose, type }) => {
  const [address, setAddress] = useState('')
  const [numberTransfer, setNumberTransfer] = useState(1)
  const [isShowDropdown, setIsShowDropdown] = useState(false)
  const [chosenAccount, setChosenAccount] = useState({})
  const [step, setStep] = useState(1)
  const [isBridging, setIsBridging] = useState(false)
  const addressInputRef = useRef()

  const { setCardInfos, setError, wallets } = useContext(GalleryContext)

  const accounts = useMemo(() => wallets, [wallets])

  const totalTransfer = 1 // TODO this

  const { locked, name, earnedKoi, totalViews, imageUrl, txId, address: _ownerAddress, tokenAddress, tokenSchema } = info

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
    if (isEmpty(chosenAccount) || isEmpty(chosenAccount.address)) {
      setError('Please select an address.')
    } else if (!numberTransfer || numberTransfer == 0) {
      setError('Please give a number of transfer')
    } else {
      setStep(step + 1)
    }
  }

  const onConfirm = async () => {
    try {
      setIsBridging(true)
      /* 
        Ethereum provider validation
      */
      const { address } = info
      if (address) {
        const account = await popupAccount.getAccount({ address })
        const provider = await account.get.provider()
        if (includes(provider, 'mainnet')) {
          setError(ERROR_MESSAGE.BRIDGE_WITH_ETH_MAINNET)
          setIsBridging(false)
          return
        }
      }
      const result = await backgroundRequest.gallery.transferNFT({
        senderAddress: _ownerAddress,
        targetAddress: address,
        txId: txId,
        numOfTransfers: numberTransfer,
        tokenAddress,
        tokenSchema
      })
      /* 
        manually update state
      */
      if (result) {
        setCardInfos(prev => prev.map(nft => {
          if (nft.txId === txId) nft.isBridging = true
          return nft
        }))
        setStep(step + 1)
      }
      setIsBridging(false)
    } catch (error) {
      setIsBridging(false)
      console.log(error)
      setError('Bridge NFT failed')
    }
  }

  const onSeeActivity = () => {
    // TODO
  }

  const onGoBack = () => {
    if (step == TRANSFER_STEPS.INPUT_INFO) {
      onClose()
    } else {
      setStep(step - 1)
    }
  }

  return (
    <div className='transfer-wallet-modal-wrapper'>
      <div className='transfer-wallet-modal'>
        {console.log('TYPE', type)}
        {(locked === undefined && type === TYPE.ETHEREUM) ?
          <div className='unsupported-nft'>
            The Ethereum bridge does not currently support this NFT. Try the bridge with a <span
              style={{textDecoration: 'underline'}} data-for='cannot-bridge' data-tip='created in October 2021 or later'>more recent NFT.
            </span>
            <ReactTooltip place='top' id='cannot-bridge' type="dark" effect="float"/>
          </div>
          
          :
          <>
            {type === TYPE.ARWEAVE &&
              <>
                {TITLES_AR[step]}
                {DESCRIPTIONS_AR[step]}
              </>
            }
            {type === TYPE.ETHEREUM &&
              <>
                {TITLES_ETH[step]}
                {DESCRIPTIONS_ETH[step]}
              </>
            }

            {/* <div className='steps'>
          {type === TYPE.ARWEAVE &&
          <>
          {STEPS_CONTENT_AR.map((step, index) => (
            <div className='step' key={step}>
              <div className='number'>{index + 1}</div>
              <div className='text'>{step}</div>
            </div>
          ))}
          </>}
          {type === TYPE.ETHEREUM &&
          <>
          {STEPS_CONTENT_ETH.map((step, index) => (
            <div className='step' key={step}>
              <div className='number'>{index + 1}</div>
              <div className='text'>{step}</div>
            </div>
          ))}
          </>}
        </div> */}

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
                      {type === TYPE.ETHEREUM &&
                        <>
                          <label className='label'>ETH Address</label>
                          <EthereumLogo className='input-logo' />
                        </>}
                      {type === TYPE.ARWEAVE &&
                        <>
                          <label className='label'>AR Address</label>
                          <ArweaveLogo className='input-logo' />
                        </>}
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
                          onClick={() => setIsShowDropdown(isShowDropdown => !isShowDropdown)}
                        ></div>
                        {isShowDropdown && (
                          <AddressDropdown
                            accounts={accounts}
                            onChange={onAddressDropdownChange}
                            type={type}
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
                        disabled={true}
                        className='input'
                      />
                      <div className='description'>
                        Many NFTs will only have 1 item minted.
                      </div>
                    </div>
                  </>
                )}

                {step == TRANSFER_STEPS.CONFIRM && (
                  <>
                    <div className='send-to'>
                      <div className='label'>Sending to:</div>
                      <div className='account'>
                        {type === TYPE.ARWEAVE && <ArweaveLogo className='account-logo' />}
                        {type === TYPE.ETHEREUM && <EthereumLogo className='account-logo' />}
                        <div className='info'>
                          {chosenAccount.accountName && (
                            <div className='name'>{chosenAccount.accountName}</div>
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
                          {chosenAccount.accountName && (
                            <div className='name'>{chosenAccount.accountName}</div>
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
                      <div className='koi-number'>
                        {type !== TYPE.ARWEAVE ? '10 KOII' : '0.00015 ETH'}
                      </div>
                    </div>
                  </div>
                )}

                {step == TRANSFER_STEPS.INPUT_INFO && (
                  <div className='transfer-button' onClick={onOneClick}>
                    {type === TYPE.ARWEAVE && 'One-Click Transfer to AR'}
                    {type === TYPE.ETHEREUM && 'One-Click Transfer to ETH'}
                  </div>
                )}

                {step == TRANSFER_STEPS.CONFIRM && (
                  <button className='transfer-button' onClick={onConfirm} disabled={isBridging}>
                    {isBridging ? 
                      'Bridging your NFT...' : 
                      type === TYPE.ARWEAVE ? 'Confirm Transfer to AR' : 'Confirm Transfer to ETH'
                    }
                  </button>
                )}

                {/* {step == TRANSFER_STEPS.SUCCESS && (
              <div className='transfer-button success' onClick={onSeeActivity}>
                See My Activity
              </div>
            )} */}
              </div>
            </div>

          </>}
        <div className='close-button' data-tip='Close' onClick={onClose}>
          <CloseIcon />
        </div>

        <div className='goback-button' data-tip='Back' onClick={onGoBack}>
          <GoBackIcon />
        </div>
      </div>
      <ReactTooltip place='top' type='dark' effect='float' />
    </div>
  )
}
