import React, { useContext, useEffect, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { ACCOUNT, TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
import DropDown from 'finnie-v2/components/DropDown'
import ToolTip from 'finnie-v2/components/ToolTip'
import formatLongString from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import ExtendIcon from 'img/extend-icon.svg'
import EmptyStarIcon from 'img/popup/star-empty-icon.svg'
import FilledStarIcon from 'img/popup/star-filled-icon.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import SaveIcon from 'img/v2/check-mark-icon-blue.svg'
import EthLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import K2Logo from 'img/v2/k2-logos/finnie-k2-logo.svg'
import RecycleBinIcon from 'img/v2/recycle-bin-icon.svg'
import CheckMarkIcon from 'img/v2/settings/check-mark-icon.svg'
import CopyIcon from 'img/v2/settings/copy-icon.svg'
import DragIcon from 'img/v2/settings/drag-icon.svg'
import EditIcon from 'img/v2/settings/edit-icon.svg'
import ReavealSeedphraseIcon from 'img/v2/settings/reveal-seedphrase-icon.svg'
import SeeExtensionIcon from 'img/v2/settings/see-extension-icon.svg'
import SeeQRIcon from 'img/v2/settings/see-QR-icon.svg'
import SolLogo from 'img/v2/solana-logo.svg'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import { setAccounts } from 'options/actions/accounts'
import { loadAllAccounts } from 'options/actions/accounts'
import { setActivatedChain } from 'options/actions/activatedChain'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setError } from 'options/actions/error'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import { GalleryContext } from 'options/galleryContext'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'
import useTokenLists from 'sharedHooks/useTokenLists'
import { getSiteConnectedAddresses } from 'utils'

import RecoveryPhraseModal from '../Settings/Security/RecoveryPhraseModal'

import QrCodeModal from './qrCodeModal'
import ToggleButton from './ToggleButton'

const AccountCard = ({
  account,
  setShowConfirmRemoveAccount,
  setRemoveAccount,
  setShowConnectedSites,
  setAccountConnectSites,
  dragProvided
}) => {
  const dispatch = useDispatch()

  const [showHex, setShowHex] = useState(true)
  const [showEmptyToken, setShowEmptyToken] = useState(true)
  const [totalViews, setTotalViews] = useState(0)

  const inputAccountNameRef = useRef(null)

  const [isDrop, setIsDrop] = useState(false)
  const [currentNetwork, setCurrentNetwork] = useState('')
  const [siteConnectedAddresses, setSiteConnectedAddresses] = useState([])

  const [editAccount, setEditAccount] = useState({})
  const [accountName, setAccountName] = useState('')

  const [showRecoveryPhraseModal, setShowRecoveryPhraseModal] = useState(false)
  const [showQrCodeModal, setShowQrCodeModal] = useState(false)

  const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
  const defaultK2AccountAddress = useSelector((state) => state.defaultAccount.K2?.address)
  const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)
  const defaultSolanaAccountAddress = useSelector((state) => state.defaultAccount.SOL?.address)

  const providerOptions = [
    {
      type: TYPE.ETHEREUM,
      value: [
        {
          label: 'ETH Mainnet',
          value: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
        },
        {
          label: 'Rinkeby TestNet',
          value: 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
        }
      ]
    },
    {
      type: TYPE.K2,
      value: [
        {
          label: 'Testnet',
          value: 'testnet'
        }
      ]
    },
    {
      type: TYPE.SOLANA,
      value: [
        {
          label: 'Mainnet',
          value: 'mainnet-beta'
        },
        {
          label: 'Testnet',
          value: 'testnet'
        },
        {
          label: 'Devnet',
          value: 'devnet'
        }
      ]
    },
    {
      type: TYPE.ARWEAVE,
      value: [
        {
          label: 'Mainnet',
          value: 'mainnet'
        }
      ]
    }
  ]

  useEffect(() => {
    const getCurrentProvider = async (accountType) => {
      let currentProvider
      if (accountType === TYPE.ETHEREUM) {
        currentProvider = await storage.setting.get.ethereumProvider()
      } else if (accountType === TYPE.SOLANA) {
        currentProvider = await storage.setting.get.solanaProvider()
      } else if (accountType === TYPE.K2) {
        currentProvider = await storage.setting.get.k2Provider()
      } else if ((accountType = TYPE.ARWEAVE)) {
        currentProvider = 'mainnet'
      }

      setCurrentNetwork(currentProvider)
    }

    const loadConnectedSites = async () => {
      try {
        dispatch(setIsLoading)
        const siteAddresses = await getSiteConnectedAddresses(account.address, account.type)
        console.log('siteAddresses', siteAddresses)
        setSiteConnectedAddresses(siteAddresses)
        dispatch(setLoaded)
      } catch (error) {
        console.log('Load connected sites - Error: ', error.message)
        dispatch(setError(error.message))
        dispatch(setLoaded)
      }
    }

    const countTotalViews = () => {
      let totalAssetViews = 0
      if (account.type === TYPE.ARWEAVE) {
        for (let asset of account.totalAssets) {
          totalAssetViews += asset.totalViews
        }
      }
      setTotalViews(totalAssetViews)
    }

    loadConnectedSites()
    getCurrentProvider(account.type)
    countTotalViews()
  }, [account])

  const isDefaultAccount = (account) => {
    switch (account.type) {
      case TYPE.ARWEAVE:
        return account.address === defaultArweaveAccountAddress
      case TYPE.K2:
        return account.address === defaultK2AccountAddress
      case TYPE.ETHEREUM:
        return account.address === defaultEthereumAccountAddress
      case TYPE.SOLANA:
        return account.address === defaultSolanaAccountAddress
      default:
        return false
    }
  }

  const onNetworkChange = async (networkAddress) => {
    if (networkAddress !== currentNetwork) {
      switch (account.type) {
        case TYPE.K2:
          await onChangeK2Provider(networkAddress)
          break
        case TYPE.ETHEREUM:
          await onChangeEthereumProvider(networkAddress)
          break
        case TYPE.SOLANA:
          await onChangeSolanaProvider(networkAddress)
          break
        default:
          dispatch(setError('Invalid network type'))
          break
      }
    }
  }

  useEffect(() => {
    inputAccountNameRef.current?.focus()
  }, [editAccount])

  const handleKeyDown = async (e, account) => {
    if (e.keyCode === 13) {
      handleChangeAccountName(account)
    }
  }

  const handleChangeAccountName = async (account) => {
    try {
      if (editAccount !== account) {
        setEditAccount(account)
        setAccountName(account.accountName)
        return
      }

      if (isEmpty(accountName)) {
        dispatch(setError('Account name cannot be empty.'))
        setEditAccount({})
        return
      }

      if (accountName !== account.accountName) {
        await backgroundRequest.wallet.changeAccountName({
          address: account.address,
          newName: accountName
        })
        const allData = await popupAccount.getAllMetadata()
        dispatch(setAccounts(allData))
      }

      setEditAccount({})
    } catch (err) {
      dispatch(setError(err.message))
    }
  }

  const handleChangeDisplayAccount = async (account) => {
    try {
      await storage.setting.set.activatedChain(account.type)
      dispatch(setActivatedChain(account.type))
      dispatch(setDefaultAccount(account))
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
      })
    } catch (error) {
      dispatch(setError(error.message))
    }
  }

  const CopyAddressIcon = ({ address }) => {
    const [isCopied, setIsCopied] = useState(false)

    const onCopy = () => {
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 3000)
    }

    return (
      <div
        className="flex items-center justify-center my-auto bg-lightBlue rounded-full shadow-sm cursor-pointer"
        style={{ width: '16px', height: '16px' }}
      >
        <CopyToClipboard text={address} onCopy={onCopy}>
          {isCopied ? (
            <CheckMarkIcon style={{ width: '13px', height: '12px' }} />
          ) : (
            <CopyIcon style={{ width: '14px', height: '14px' }} />
          )}
        </CopyToClipboard>
      </div>
    )
  }

  const onChangeK2Provider = async (value) => {
    dispatch(setIsLoading)
    const _currentNetwork = currentNetwork
    try {
      setCurrentNetwork(value)
      await backgroundRequest.gallery.updateK2Provider({
        k2Provider: value,
        isGalleryRequest: true
      })

      // load balance
      await backgroundRequest.wallet.loadBalanceAsync()

      // update account state
      await dispatch(loadAllAccounts())
    } catch (error) {
      setCurrentNetwork(_currentNetwork)
      dispatch(setError(error.message))
      console.log('Failed to change K2 provider', error.message)
    } finally {
      dispatch(setLoaded)
    }
  }

  const onChangeEthereumProvider = async (value) => {
    dispatch(setIsLoading)
    const _currentNetwork = currentNetwork
    try {
      setCurrentNetwork(value)
      await backgroundRequest.gallery.updateEthereumProvider({
        ethereumProvider: value,
        isGalleryRequest: true
      })

      // load balance
      await backgroundRequest.wallet.loadBalanceAsync()

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.NETWORK_CHANGED })
      })

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.CHAIN_CHANGED })
      })

      // update account state
      await dispatch(loadAllAccounts())
    } catch (error) {
      setCurrentNetwork(_currentNetwork)
      dispatch(setError(error.message))
      console.log('Failed to change Ethereum provider', error.message)
    } finally {
      dispatch(setLoaded)
    }
  }

  const onChangeSolanaProvider = async (value) => {
    dispatch(setIsLoading)
    const _currentNetwork = currentNetwork
    try {
      setCurrentNetwork(value)
      await backgroundRequest.gallery.updateSolanaProvider({
        solanaProvider: value,
        isGalleryRequest: true
      })

      // load balance
      await backgroundRequest.wallet.loadBalanceAsync()

      // update account state
      await dispatch(loadAllAccounts())
    } catch (error) {
      setCurrentNetwork(_currentNetwork)
      dispatch(setError(error.message))
      console.log('Failed to change Solana provider', error.message)
    } finally {
      dispatch(setLoaded)
    }
  }

  const { tokenList } = useTokenLists({
    account,
    address: account.address,
    setIsLoading: () => {},
    currentProviderAddress: currentNetwork
  })

  return (
    <div className="mt-4.5 text-indigo select-none">
      <div
        className="relative py-6 -mb-1.25 bg-trueGray-100 rounded-lg flex items-center justify-start shadow-md overflow-hidden"
        style={{ maxWidth: '707px', height: '124px' }}
      >
        <div
          // className="flex items-center justify-center bg-white shadow rounded-r-lg"
          style={{ width: '22.5px', height: '55.25px' }}
          // {...dragProvided.dragHandleProps}
        >
          {/* <DragIcon style={{ width: '4.93px', height: '31.49px' }} /> */}
        </div>
        {account.type === TYPE.K2 && (
          <K2Logo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        {account.type === TYPE.ETHEREUM && (
          <EthLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        {account.type === TYPE.SOLANA && (
          <SolLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        {account.type === TYPE.ARWEAVE && (
          <ArweaveLogo style={{ width: '25px', height: '25px' }} className="self-start ml-4" />
        )}
        <div className="flex flex-col ml-2.25 mr-4.5 mt-1" style={{ width: '296px' }}>
          <div className="flex items-center text-base tracking-finnieSpacing-tight leading-6">
            {editAccount?.address === account.address ? (
              <input
                ref={(accountNameInput) => (inputAccountNameRef.current = accountNameInput)}
                className="w-40 pl-1.5 bg-trueGray-400 bg-opacity-50 rounded-t-sm border-b-2 border-blue-850 focus:outline-none"
                value={accountName}
                onKeyDown={(e) => handleKeyDown(e, account)}
                onChange={(e) => setAccountName(e.target.value)}
                // style={{ height: '17.23px' }}
              />
            ) : (
              <div
                // className="max-w-24 pl-6.5"
                className="font-semibold max-w-40"
              >
                {formatLongString(account.accountName, 20)}
              </div>
            )}
            {isEmpty(editAccount) || editAccount?.address !== account.address ? (
              <EditIcon
                onClick={() => handleChangeAccountName(account)}
                className="inline ml-3.75 bg-lightBlue rounded-full shadow-sm cursor-pointer"
                style={{ width: '16px', height: '16px' }}
              />
            ) : (
              <SaveIcon
                onClick={() => handleChangeAccountName(account)}
                className="inline ml-3.75 bg-lightBlue rounded-full shadow-sm cursor-pointer"
                style={{ width: '16px', height: '16px' }}
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-success-700 text-opacity-80 text-2xs font-normal leading-6 tracking-finnieSpacing-tight">
              {account.address}
            </div>
            <CopyAddressIcon address={account.address} key={account.address} />
          </div>

          {account.type === TYPE.K2 && (
            <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
              Balance:{' '}
              {formatNumber(account.balance, 4) !== 'NaN'
                ? formatNumber(account.balance / Math.pow(10, 9), 4)
                : '0'}{' '}
              KOII
            </div>
          )}
          {account.type === TYPE.ETHEREUM && (
            <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
              Balance:{' '}
              {formatNumber(account.balance, 4) !== 'NaN' ? formatNumber(account.balance, 4) : '0'}{' '}
              ETH
            </div>
          )}
          {account.type === TYPE.SOLANA && (
            <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
              Balance:{' '}
              {formatNumber(account.balance, 4) !== 'NaN'
                ? formatNumber(account.balance / Math.pow(10, 9), 4)
                : '0'}{' '}
              SOL
            </div>
          )}
          {account.type === TYPE.ARWEAVE && (
            <>
              <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
                Balance: {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'} AR
              </div>
              {/* <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight">
                Koii Balance:{' '}
                {isNumber(account.koiBalance) ? formatNumber(account.koiBalance, 2) : '0'} KOII
              </div> */}
            </>
          )}

          <div className="font-normal text-xs flex items-center tracking-finnieSpacing-tight leading-6">
            Assets: {account.totalAssets.length}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div
            className="flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1"
            style={{ width: '75px', height: '75px' }}
          >
            <div className="flex items-center text-center font-normal text-xl leading-8 tracking-finnieSpacing-tight">
              {tokenList?.length}
            </div>
            <div className="flex items-center text-center font-normal text-xs tracking-finnieSpacing-tight">
              {tokenList?.length > 1 ? 'Coins' : 'Coin'}
            </div>
          </div>
          <div
            className="flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1"
            style={{ width: '75px', height: '75px' }}
          >
            <div className="flex items-center text-center font-normal text-xl leading-8 tracking-finnieSpacing-tight">
              {account.totalAssets.length}
            </div>
            <div className="flex items-center text-center font-normal text-xs tracking-finnieSpacing-tight">
              Assets
            </div>
          </div>
          {account.type === TYPE.ARWEAVE ? (
            <div
              className="flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1"
              style={{ width: '75px', height: '75px' }}
            >
              <div className="flex items-center text-center font-normal text-xl leading-8 tracking-finnieSpacing-tight">
                {totalViews}
              </div>
              <div className="flex items-center text-center font-normal text-xs tracking-finnieSpacing-tight">
                Views
              </div>
            </div>
          ) : (
            <div
              className={clsx(
                'flex flex-col justify-center items-center shadow-sm bg-trueGray-400 rounded',
                'font-normal text-xs text-center tracking-finnieSpacing-tight'
              )}
              style={{ width: '75px', height: '75px' }}
              data-tip={'Views'}
            >
              Coming Soon
            </div>
          )}
          <ToolTip />
        </div>
        <div className="h-full flex flex-col justify-between items-center ml-4 mr-1">
          <div
            className="flex items-center justify-center"
            onClick={() => handleChangeDisplayAccount(account)}
          >
            {isDefaultAccount(account) ? (
              <FilledStarIcon
                style={{ width: '20px', height: '20px' }}
                className="cursor-pointer"
              />
            ) : (
              <EmptyStarIcon style={{ width: '20px', height: '20px' }} className="cursor-pointer" />
            )}
          </div>
          <div
            className="flex items-center justify-center bg-lightBlue shadow-sm rounded-full cursor-pointer"
            style={{ width: '24px', height: '24px' }}
            onClick={() => setIsDrop((prev) => !prev)}
          >
            <ExtendIcon
              style={{ width: '8px', height: '4.25px' }}
              className={clsx(isDrop && 'transform rotate-180')}
            />
          </div>
        </div>
      </div>

      {isDrop && (
        <div
          className="relative flex items-center justify-start bg-trueGray-600 px-5 py-6"
          style={{ maxWidth: '707px', height: '183px' }}
        >
          <div className="w-1/3 h-full flex flex-col gap-6">
            <div className="flex gap-2.75 items-start">
              <div className="w-1/2 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                Account Balance:
              </div>
              <div className="flex flex-col gap-1">
                {tokenList?.map((token, idx) => (
                  <div className="font-normal text-xs tracking-finnieSpacing-tight" key={idx}>
                    {formatNumber(token.displayingBalance, 4)} {token.symbol}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2.75 items-start">
              <div className="w-1/2 flex justify-end text-right font-semibold text-xs tracking-finnieSpacing-tight">
                NFT Assets:
              </div>
              <div className="font-normal text-xs tracking-finnieSpacing-tight">
                {account.totalAssets.length} {account.type === TYPE.ARWEAVE && 'AR'}
                {account.type === TYPE.ETHEREUM && 'ETH'}
                {account.type === TYPE.SOLANA && 'SOL'}
              </div>
            </div>
          </div>

          <div className="w-1/3 h-full flex flex-col gap-4.5">
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">Network: </div>
              <div style={{ width: '154px' }}>
                <DropDown
                  options={providerOptions.find((o) => o.type === account.type)?.value}
                  value={currentNetwork}
                  onChange={onNetworkChange}
                  filterSupported={false}
                  variant="light"
                  size="sm"
                />
              </div>
            </div>

            {/* SHOW HEX DATA */}
            {/* <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">
                Show Hex data:{' '}
              </div>
              <ToggleButton value={showHex} setValue={setShowHex} />
            </div> */}

            {/* HIDE EMPTY TOKEN */}
            {/* <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">
                Hide empty Token:{' '}
              </div>
              <ToggleButton value={showEmptyToken} setValue={setShowEmptyToken} />
            </div> */}
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs tracking-finnieSpacing-tight">
                Dapp Connections:{' '}
              </div>
              <div
                className="text-xs font-normal tracking-finnieSpacing-tight underline cursor-pointer"
                onClick={() => {
                  setShowConnectedSites(true)
                  setAccountConnectSites(account)
                }}
              >
                {siteConnectedAddresses.length} sites
              </div>
            </div>
          </div>

          <div className="w-1/3 h-full flex flex-col gap-4.5">
            <div
              onClick={() => setShowRecoveryPhraseModal(true)}
              className="w-full h-6 flex items-center justify-between"
            >
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                Reveal Secret Phrase:{' '}
              </div>
              <div
                className="bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <ReavealSeedphraseIcon style={{ width: '15.43px', height: '15.17px' }} />
              </div>
            </div>

            <div
              onClick={() => setShowQrCodeModal(true)}
              className="w-full h-6 flex items-center justify-between"
            >
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                See QR code:{' '}
              </div>
              <div
                className="bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <SeeQRIcon style={{ width: '12.89px', height: '12.93px' }} />
              </div>
            </div>

            {/* SEE ON EXTENSION */}
            {/* <div className="w-full h-6 flex items-center justify-between">
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                See on extension:{' '}
              </div>
              <div
                className="bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <SeeExtensionIcon style={{ width: '12.54px', height: '15.75px' }} />
              </div>
            </div> */}
          </div>
          <div
            className="absolute bottom-2.5 right-5 flex items-center justify-center bg-warning-300 rounded-sm shadow cursor-pointer"
            onClick={() => {
              setShowConfirmRemoveAccount(true)
              setRemoveAccount(account)
            }}
            style={{ width: '27px', height: '27px' }}
          >
            <RecycleBinIcon style={{ width: '15.7px', height: '19px' }} />
          </div>
        </div>
      )}
      {showRecoveryPhraseModal && (
        <RecoveryPhraseModal account={account} close={() => setShowRecoveryPhraseModal(false)} />
      )}
      {showQrCodeModal && <QrCodeModal account={account} close={() => setShowQrCodeModal(false)} />}
    </div>
  )
}

export default AccountCard
