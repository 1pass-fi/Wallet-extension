import React, { useContext, useRef, useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import isEmpty from 'lodash/isEmpty'
import includes from 'lodash/includes'
import find from 'lodash/find'
import ReactTooltip from 'react-tooltip'
import Web3 from 'web3'

import GoBackIcon from 'img/goback-icon-26px.svg'
import ArweaveLogo from 'img/arweave-icon.svg'
import EthereumLogo from 'img/ethereum-logo-18.svg'
import StackIcon from 'img/stack-icon.svg'
import StackWhiteIcon from 'img/stack-white-icon.svg'
import WarningIcon from 'img/dangerous-logo.svg'
import FinnieIcon from 'img/finnie-koi-logo-blue.svg'
import QuestionIcon from 'img/question-tooltip.svg'

import { GalleryContext } from 'options/galleryContext'
import { TYPE } from 'constants/accountConstants'
import { ETH_NETWORK_PROVIDER, KOI_ROUTER_CONTRACT } from 'constants/koiConstants'

import { formatNumber, getDisplayAddress } from 'options/utils'
import { getAddressesFromAddressBook } from 'utils'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import koiRouterABI from 'services/account/Account/Chains/Ethereum/abi/KoiRouter.json'
import koiTokenABI from 'services/account/Account/Chains/Ethereum/abi/KoiToken.json'

import './index.css'
import { popupAccount } from 'services/account'
import { ERROR_MESSAGE } from 'constants/koiConstants'

import { setAssets } from 'options/actions/assets'

import { isArweaveAddress } from 'utils'
import { isEthereumAddress } from 'utils'

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
      {accounts.map((account, index) => {
        if (account.type == type) {
          return (
            <div
              key={account.address + index}
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
  const [walletType, setWalletType] = useState('')
  const [estimateGasUnit, setEstimateGasUnit] = useState(0)
  const [currentGasPrice, setCurrentGasPrice] = useState(0)
  const [totalGasCost, setTotalGasCost] = useState(0)
  const [isApproved, setIsApproved] = useState(false)
  const [settingApproval, setSettingApproval] = useState(false)
  const [approvedStatusLoaded, setApprovedStatusLoaded] = useState(false)
  const [addressOptions, setAddressOptions] = useState([])

  const addressInputRef = useRef()

  const { setError } = useContext(GalleryContext)

  const accounts = useSelector(state => state.accounts)
  const assets = useSelector(state => state.assets)
  const dispatch = useDispatch()

  const totalTransfer = 1 // TODO this

  const { contentType, locked, name, earnedKoi, totalViews, imageUrl, txId, address: _ownerAddress, tokenAddress, tokenSchema } = info

  useEffect(() => {
    const getAddressList = async () => {
      const options = await getAddressesFromAddressBook()
      setAddressOptions(options)
    }

    getAddressList()
  }, [])

  useEffect(() => {
    // Use this wallet type since the current type is of the receipient
    const getWalletTypeAndApprovalStatus = async () => {
      const newWalletType = await popupAccount.getType(_ownerAddress)
      setWalletType(newWalletType)

      if (newWalletType !== TYPE.ETHEREUM) {
        setApprovedStatusLoaded(true)
        return
      }

      const account = await popupAccount.getAccount({ address: _ownerAddress })
      const provider = await account.get.provider()
      const web3 = new Web3(provider)

      const tokenContract = new web3.eth.Contract(koiTokenABI, tokenAddress)
      const koiRouterContractAddress =
        provider === ETH_NETWORK_PROVIDER.MAINNET
          ? KOI_ROUTER_CONTRACT.MAINNET
          : KOI_ROUTER_CONTRACT.RINKEBY

      const isApproved = await tokenContract.methods
        .isApprovedForAll(_ownerAddress, koiRouterContractAddress)
        .call()

      setIsApproved(isApproved)
      setApprovedStatusLoaded(true)
    }

    getWalletTypeAndApprovalStatus()
  }, [])

  useEffect(() => {
    const estimateGas = async () => {
      if(walletType === TYPE.ETHEREUM) {
        const account = await popupAccount.getAccount({ address: _ownerAddress })
        const provider = await account.get.provider()
        
        const koiRouterContractAddress = provider === ETH_NETWORK_PROVIDER.MAINNET ? KOI_ROUTER_CONTRACT.MAINNET : KOI_ROUTER_CONTRACT.RINKEBY
        
        const web3 = new Web3(provider)
        const koiRouterContract = new web3.eth.Contract(koiRouterABI, koiRouterContractAddress)
        const tokenContract = new web3.eth.Contract(koiTokenABI, tokenAddress)
        
        let newEstimateGasUnit = 0
        if(isApproved) {
          newEstimateGasUnit = await koiRouterContract.methods
            .deposit(tokenAddress, txId, 1, address)
            .estimateGas({ from: _ownerAddress, value: web3.utils.toWei('0.00015', 'ether') })
        } else {
          newEstimateGasUnit = await tokenContract.methods
            .setApprovalForAll(koiRouterContractAddress, true)
            .estimateGas({ from: _ownerAddress })
        }

        setEstimateGasUnit(newEstimateGasUnit)
      }
    }

    estimateGas()
  }, [walletType, isApproved])
  
  useEffect(() => {
    const getCurrentGasPrice = async () => {
      if(walletType === TYPE.ETHEREUM && !isBridging) {
        const account = await popupAccount.getAccount({ address: _ownerAddress })
        const provider = await account.get.provider()

        const web3 = new Web3(provider)
          
        const currentGasPrice = await web3.eth.getGasPrice()
        setCurrentGasPrice(currentGasPrice)
      }
    }

    getCurrentGasPrice()
    const intervalId = setInterval(() => {
      getCurrentGasPrice()
    }, 3000)

    return () => clearInterval(intervalId)
  }, [walletType, isApproved, isBridging])


  useEffect(() => {
    const currentGasBN = Web3.utils.toBN(currentGasPrice)
    const newTotalGas = Web3.utils.fromWei(currentGasBN.muln(estimateGasUnit))
  
    setTotalGasCost(newTotalGas)
  }, [currentGasPrice, estimateGasUnit])
  
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
    const account = find(accounts, account => account.address === _ownerAddress)

    if (isEmpty(chosenAccount) || isEmpty(chosenAccount.address)) {
      setError('Please select an address.')
      return
    }

    if (type === TYPE.ARWEAVE) {
      if (!isArweaveAddress(chosenAccount.address)) {
        setError('Invalid AR Address')
        return
      }
    }

    if (type === TYPE.ETHEREUM) {
      if (!isEthereumAddress(chosenAccount.address)) {
        setError('Invalid ETH Address')
        return
      }
    }

    if (!numberTransfer || numberTransfer == 0) {
      setError('Please give a number of transfer')
      return
    }

    if (account?.balance < 0.000001 || account?.koiBalance < 10) {
      setError('Not enough AR or KOII')
      return
    }

    setStep(step + 1)
  }

  const onConfirm = async () => {
    try {
      setIsBridging(true)

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
        const nfts = assets.nfts.map(nft => {
          if (nft.txId === txId) nft.isBridging = true
          return nft
        })
        dispatch(setAssets({ nfts }))
        setStep(step + 1)
      }
      setIsBridging(false)
    } catch (error) {
      setIsBridging(false)
      console.log('ERROR', error)
      if (error.message === ERROR_MESSAGE.NFT_NOT_EXIST_ON_CHAIN) {
        setError (ERROR_MESSAGE.NFT_NOT_EXIST_ON_CHAIN)
      } else {
        setError(ERROR_MESSAGE.BRIDGE_NFT_FAILED)
      }
    }
  }

  const handleSetApproval = async () => {
    try {
      setSettingApproval(true)

      // Using this same function as tranfering, since the logic is all handled by the backend
      await backgroundRequest.gallery.transferNFT({
        senderAddress: _ownerAddress,
        targetAddress: address,
        txId: txId,
        numOfTransfers: numberTransfer,
        tokenAddress,
        tokenSchema
      }) 

      setIsApproved(true)
      setSettingApproval(false)
    } catch (error) {
      setSettingApproval(false)
      setError('Something went wrong. Please try again later!')
    }
  }

  const onGoBack = () => {
    if (step == TRANSFER_STEPS.INPUT_INFO) {
      onClose()
    } else {
      setStep(step - 1)
    }
  }

  return (
    <>
      <div className='transfer-wallet-modal'>
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

            <div className='content'>
              <div className='left'>
                {(includes(contentType, 'image') ||
                    includes(contentType, 'svg+xml')) && (
                  <img src={imageUrl} className="nft-img" />
                )}
                {includes(contentType, 'video') && (
                  <video
                    width={320}
                    height={240}
                    src={imageUrl}
                    className="nft-img"
                    controls
                    autoPlay
                  />
                )}
                {includes(contentType, 'html') && (
                  <div className="nft-img-iframe">
                    <div className="iframe-wrapper">
                      <iframe frameBorder="0" src={imageUrl} />
                    </div>
                  </div>
                )}
                <div className='name'>{name}</div>
                {type === TYPE.ETHEREUM && <div className='views'>{totalViews} views</div>}
                {type === TYPE.ETHEREUM && <div className='earned-koi'>
                  <FinnieIcon />
                  {formatNumber(earnedKoi)} KOII earned
                </div>}
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
                            accounts={[...accounts, ...addressOptions]}
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
                      <div className='description-one-item'>
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
                  type !== TYPE.ARWEAVE ? (
                    <div className="estimate-cost">
                      <div className="text">Estimated costs:</div>
                      <div className="number">
                        <div className="koi-number">10 KOII</div>
                      </div>
                    </div>
                  ) : (
                    <div className="estimate-cost--eth">
                      {isApproved && (
                        <div className="cost">
                          <span>Cost:</span>
                          <span>0.000150 ETH</span>
                        </div>
                      )}
                      <div className="cost">
                        <div
                          className="question-mark-icon"
                          data-tip="Gas fees are paid to crypto miners who process transactions on the Ethereum network. Koii does not profit from gas fees. <br/> <br/>
                          Gas fees are set by the network and fluctuate based on network traffic and transaction complexity.<br/> <br/>
                          This estimate will update about every 30 seconds."
                          data-for="gas-estimate-note"
                        >
                          <QuestionIcon />
                        </div>
                        <span>Gas estimate:</span>
                        <span>{formatNumber(totalGasCost, 6)} ETH</span>
                      </div>
                      <div className="estimate-note">
                        {'update in < 30 sec.'}
                      </div>
                      <div className="total-cost">
                        <span>Total: </span>
                        <span className="total-number">{isApproved ? formatNumber(Number(totalGasCost) + 0.00015, 6) : formatNumber(Number(totalGasCost), 6)} ETH</span>
                      </div>
                    </div>
                  )
                )}                

                {step == TRANSFER_STEPS.INPUT_INFO && (
                  <>
                    {type === TYPE.ARWEAVE && !isApproved && (
                      <button className="transfer-button" onClick={handleSetApproval} disabled={settingApproval || !approvedStatusLoaded}>
                        {settingApproval ? 'Setting approval...' : 'Set approval for all'}
                      </button>
                    )}
                    {type === TYPE.ARWEAVE && isApproved && (
                      <button className='transfer-button' onClick={onOneClick}>
                        One-Click Transfer to AR
                      </button> 
                    )} 
                    {type === TYPE.ETHEREUM && (
                      <button className='transfer-button' onClick={onOneClick}>
                        One-Click Transfer to ETH
                      </button>
                    )}
                  </>
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
        <div className='goback-button' data-tip='Back' onClick={onGoBack}>
          <GoBackIcon />
        </div>
        <div className='foot-note'>
          This feature is in beta.
        </div>
      </div>
      <ReactTooltip place='top' type='dark' effect='float' />
      <ReactTooltip id="gas-estimate-note" border={true} className="gas-estimate-note-tooltip" multiline={true} place='left' effect='float' />
    </>
  )
}
