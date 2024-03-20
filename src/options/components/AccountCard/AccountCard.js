import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useDispatch, useSelector } from 'react-redux'
import clsx from 'clsx'
import { ACCOUNT, TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
import EvmLogo from 'img/evm-logo.svg'
import ExtendIcon from 'img/extend-icon.svg'
import EmptyStarIcon from 'img/popup/star-empty-icon.svg'
import FilledStarIcon from 'img/popup/star-filled-icon.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import SaveIcon from 'img/v2/check-mark-icon-blue.svg'
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
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import { setAccounts } from 'options/actions/accounts'
import { loadAllAccounts } from 'options/actions/accounts'
import { setActivatedChain } from 'options/actions/activatedChain'
import { setAssets } from 'options/actions/assets'
import { setDefaultAccount } from 'options/actions/defaultAccount'
import { setError } from 'options/actions/error'
import { setIsLoading, setLoaded } from 'options/actions/loading'
import { setWalletLoaded } from 'options/actions/walletLoaded'
import DropDown from 'options/components/DropDown'
import ToolTip from 'options/components/ToolTip'
import { GalleryContext } from 'options/galleryContext'
import classifyAssets from 'options/utils/classifyAssets'
import formatLongString from 'options/utils/formatLongString'
import formatNumber from 'options/utils/formatNumber'
import { popupAccount } from 'services/account'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import storage from 'services/storage'
import DropdownNew from 'sharedComponents/Dropdown'
import useTokenLists from 'sharedHooks/useTokenLists'
import { getSiteConnectedAddresses } from 'utils'

import RecoveryPhraseModal from '../Settings/Security/RecoveryPhraseModal'

import QrCodeModal from './qrCodeModal'
import ToggleButton from './ToggleButton'

const predefinedProviderOptions = [
  {
    type: TYPE.ETHEREUM,
    value: [
      {
        label: 'ETH Mainnet',
        value: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
      },
      {
        label: 'Goerli TestNet',
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

const AccountCard = ({
  account,
  setShowConfirmRemoveAccount,
  setRemoveAccount,
  setShowConnectedSites,
  setAccountConnectSites,
  dragProvided
}) => {
  const { setReloadApp, reloadApp } = useContext(GalleryContext)
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

  const [providerOptions, setProviderOptions] = useState([
    {
      type: TYPE.ETHEREUM,
      value: [...predefinedProviderOptions[0].value]
    },
    {
      type: TYPE.K2,
      value: [...predefinedProviderOptions[1].value]
    },
    {
      type: TYPE.SOLANA,
      value: [...predefinedProviderOptions[2].value]
    },
    {
      type: TYPE.ARWEAVE,
      value: [...predefinedProviderOptions[3].value]
    }
  ])

  const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
  const defaultK2AccountAddress = useSelector((state) => state.defaultAccount.K2?.address)
  const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)
  const defaultSolanaAccountAddress = useSelector((state) => state.defaultAccount.SOL?.address)
  const networkMetadata = useSelector((state) => state.networkMetadata)

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

  useEffect(() => {
    const getProviderOptions = async () => {
      const addedEvmNetworks = await storage.setting.get.addedEvmNetworks()
      providerOptions[0].value = [...predefinedProviderOptions[0].value, ...addedEvmNetworks]
      setProviderOptions(providerOptions)
    }

    if (reloadApp) getProviderOptions()
  }, [reloadApp])

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
          dispatch(setError(chrome.i18n.getMessage('invalidNetworkType')))
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
        dispatch(setError(chrome.i18n.getMessage('emptyAccountNameError')))
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
        className={clsx(
          'w-4 xl:w-5 2xl:w-6 3xl:w-8 h-4 xl:h-5 2xl:h-6 3xl:h-8',
          'flex items-center justify-center my-auto bg-lightBlue rounded-full shadow-sm cursor-pointer'
        )}
      >
        <CopyToClipboard text={address} onCopy={onCopy} data-testid="account-card-copy-icon">
          {isCopied ? (
            <CheckMarkIcon className="w-2.75 xl:w-3.5 2xl:w-4.25 3xl:w-5 h-2.75 xl:h-3.5 2xl:h-4.25 3xl:h-5" />
          ) : (
            <CopyIcon className="w-3 xl:w-4 2xl:w-5 3xl:w-6 h-3 xl:h-4 2xl:h-5 3xl:h-6" />
          )}
        </CopyToClipboard>
      </div>
    )
  }

  const onChangeK2Provider = async (value) => {
    const _currentNetwork = currentNetwork
    try {
      setCurrentNetwork(value)
      await backgroundRequest.gallery.updateK2Provider({
        k2Provider: value,
        isGalleryRequest: true
      })

      setReloadApp(false)
      setReloadApp(true)
    } catch (error) {
      setCurrentNetwork(_currentNetwork)
      dispatch(setError(error.message))
      console.log('Failed to change K2 provider', error.message)
    } finally {
      dispatch(setLoaded)
    }
  }

  const onChangeEthereumProvider = async (value) => {
    await backgroundRequest.gallery.updateEthereumProvider({
      ethereumProvider: value,
      isGalleryRequest: true
    })

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.NETWORK_CHANGED })
    })

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.CHAIN_CHANGED })
    })

    setReloadApp(false)
    setReloadApp(true)
  }

  const onChangeSolanaProvider = async (value) => {
    const _currentNetwork = currentNetwork
    try {
      setCurrentNetwork(value)
      await backgroundRequest.gallery.updateSolanaProvider({
        solanaProvider: value,
        isGalleryRequest: true
      })

      setReloadApp(false)
      setReloadApp(true)
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

  const totalCoins = useMemo(() => {
    let total = 0
    if (tokenList) {
      tokenList.forEach((token) => {
        if (Number(token?.displayingBalance) > 0) total++
      })
    }
    return total
  }, [tokenList])

  const tokenSymbol = useMemo(() => {
    switch (account.type) {
      case TYPE.K2:
        return 'KOII'
      case TYPE.ARWEAVE:
        return 'AR'
      case TYPE.ETHEREUM:
        return get(networkMetadata, 'currencySymbol')
      case TYPE.SOLANA:
        return 'SOL'
    }
  }, [networkMetadata, account])

  const balanceString = useMemo(() => {
    function formatNumber(number) {
      if (!isNumber(number)) return '---'
      if (number.toFixed(3) === '0.000') return '0'
      if (number < 10) {
        return Number.isInteger(number) ? number : number.toFixed(3)
      } else if (number < 1000) {
        return Number.isInteger(number) ? number : number.toFixed(1)
      } else if (number < 1000000) {
        return (number / 1000).toFixed(1) + 'K'
      } else {
        return (number / 1000000).toFixed(1) + 'M'
      }
    }

    if (!isEmpty(account)) {
      let balanceNumber
      switch (account.type) {
        case TYPE.K2:
          balanceNumber = get(account, 'balance', 0) / Math.pow(10, 9)
          break
        case TYPE.ETHEREUM:
          balanceNumber = get(account, 'balance', 0)
          break
        case TYPE.SOLANA:
          balanceNumber = get(account, 'balance', 0) / Math.pow(10, 9)
          break
        case TYPE.ARWEAVE:
          balanceNumber = get(account, 'balance', 0)
          break
      }
      return formatNumber(Number(balanceNumber))
    }
  }, [account])

  return (
    <div className="mt-4.5 text-indigo select-none" data-testid="account-card-setting-page">
      <div
        className={clsx(
          'sm:overflow-y-scroll sm:py-4 sm:h-36 md:h-auto md:py-4 lg:h-32 lg:overflow-y-hidden max-w-lg xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl xl:h-34.75 2xl:h-37.75 3xl:h-40',
          'relative py-6 -mb-1.25 bg-trueGray-100 rounded-lg',
          'flex items-center justify-start shadow-md overflow-hidden'
        )}
      >
        <div
          className="xs:hidden md:w-5 md:h-14"
          // className="flex items-center justify-center bg-white shadow rounded-r-lg"
          style={{ width: '22.5px', height: '55.25px' }}
          // {...dragProvided.dragHandleProps}
        >
          {/* <DragIcon style={{ width: '4.93px', height: '31.49px' }} /> */}
        </div>
        {account.type === TYPE.K2 && (
          <K2Logo className="self-start w-6.25 xl:w-8 2xl:w-10 3xl:w-12 h-6.25 xl:h-8 2xl:h-10 3xl:h-12 ml-4" />
        )}
        {account.type === TYPE.ETHEREUM && (
          <EvmLogo className="self-start w-6.25 xl:w-8 2xl:w-10 3xl:w-12 h-6.25 xl:h-8 2xl:h-10 3xl:h-12 ml-4" />
        )}
        {account.type === TYPE.SOLANA && (
          <SolLogo className="self-start w-6.25 xl:w-8 2xl:w-10 3xl:w-12 h-6.25 xl:h-8 2xl:h-10 3xl:h-12 ml-4" />
        )}
        {account.type === TYPE.ARWEAVE && (
          <ArweaveLogo className="self-start w-6.25 xl:w-8 2xl:w-10 3xl:w-12 h-6.25 xl:h-8 2xl:h-10 3xl:h-12 ml-4" />
        )}
        {/* container */}
        <div className="md:flex md:flex-col lg:flex lg:flex-row">
          <div className="sm:w-1/2 md:w-full flex flex-col ml-2.25 xl:ml-3 2xl:ml-4 3xl:ml-6 mr-4.5 xl:mr-6 2xl:mr-7 3xl:mr-9 w-74 xl:w-83 2xl:w-90.5 3xl:w-100">
            {/* Account Name and Edit */}
            <div className="flex items-center text-base 2xl:text-lg 3xl:text-xl tracking-finnieSpacing-tight leading-6">
              {editAccount?.address === account.address ? (
                <input
                  ref={(accountNameInput) => (inputAccountNameRef.current = accountNameInput)}
                  className="w-40 pl-1.5 bg-trueGray-400 bg-opacity-50 rounded-t-sm border-b-2 border-blue-850 focus:outline-none"
                  value={accountName}
                  onKeyDown={(e) => handleKeyDown(e, account)}
                  onChange={(e) => setAccountName(e.target.value)}
                  style={{ height: '17.23px' }}
                  data-testid="input-account-name"
                />
              ) : (
                <div
                  // className="max-w-24 pl-6.5"
                  className="font-semibold max-w-40"
                  data-testid="account-card-accountname"
                >
                  {formatLongString(account.accountName, 20)}
                </div>
              )}
              {isEmpty(editAccount) || editAccount?.address !== account.address ? (
                <EditIcon
                  onClick={() => handleChangeAccountName(account)}
                  className="w-4 xl:w-5 2xl:w-6 3xl:w-8 h-4 xl:h-5 2xl:h-6 3xl:h-8 inline ml-3.75 bg-lightBlue rounded-full shadow-sm cursor-pointer"
                  data-testid="edit-account-name-icon"
                />
              ) : (
                <SaveIcon
                  onClick={() => handleChangeAccountName(account)}
                  className="w-4 xl:w-5 2xl:w-6 3xl:w-8 h-4 xl:h-5 2xl:h-6 3xl:h-8 inline ml-3.75 bg-lightBlue rounded-full shadow-sm cursor-pointer"
                  data-testid="save-account-name-icon"
                />
              )}
            </div>

            {/* Account address */}
            <div className="flex items-center justify-start">
              <div
                className="sm:truncate md:truncate-none flex items-center text-success-700 text-opacity-80 text-2xs 2xl:text-11px 3xl:text-xs font-normal leading-6 tracking-finnieSpacing-tight"
                data-testid="account-card-address"
              >
                {account.address}
              </div>
              <CopyAddressIcon address={account.address} key={account.address} />
            </div>

            {/* Account Type */}
            {account.type === TYPE.K2 && (
              <div
                className="font-normal text-xs 2xl:text-sm 3xl:text-base flex items-center tracking-finnieSpacing-tight"
                data-testid="account-card-balance"
              >
                {chrome.i18n.getMessage('balance')}
                {': '}
                {formatNumber(account.balance, 4) !== 'NaN'
                  ? formatNumber(account.balance / Math.pow(10, 9), 4)
                  : '0'}{' '}
                KOII
              </div>
            )}
            {account.type === TYPE.ETHEREUM && (
              <div
                className="font-normal text-xs 2xl:text-sm 3xl:text-base flex items-center tracking-finnieSpacing-tight"
                data-testid="account-card-balance"
              >
                {chrome.i18n.getMessage('balance')}
                {': '}
                {formatNumber(account.balance, 4) !== 'NaN'
                  ? formatNumber(account.balance, 4)
                  : '0'}{' '}
                {tokenSymbol}
              </div>
            )}
            {account.type === TYPE.SOLANA && (
              <div
                className="font-normal text-xs 2xl:text-sm 3xl:text-base flex items-center tracking-finnieSpacing-tight"
                data-testid="account-card-balance"
              >
                {chrome.i18n.getMessage('balance')}
                {': '}
                {formatNumber(account.balance, 4) !== 'NaN'
                  ? formatNumber(account.balance / Math.pow(10, 9), 4)
                  : '0'}{' '}
                SOL
              </div>
            )}
            {account.type === TYPE.ARWEAVE && (
              <>
                <div
                  className="font-normal text-xs 2xl:text-sm 3xl:text-base flex items-center tracking-finnieSpacing-tight"
                  data-testid="account-card-balance"
                >
                  {chrome.i18n.getMessage('balance')}
                  {': '}
                  {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'} AR
                </div>
              </>
            )}

            <div
              className="font-normal text-xs 2xl:text-sm 3xl:text-base flex items-center tracking-finnieSpacing-tight leading-6"
              data-testid="account-card-assets"
            >
              {chrome.i18n.getMessage('assets')}
              {': '}
              {account.totalAssets.length}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* FIRST BLOCK */}
            <div className="sm:w-12 sm:h-12 md:w-18.75 md:h-18.75 xl: 2xl: 3xl:w-20 xl: 2xl: 3xl:h-20 flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1">
              <div className="sm:text-xs sm:leading-4 flex items-center text-center font-normal md:text-xl xl: 2xl: 3xl:text-2xl leading-8 tracking-finnieSpacing-tight">
                {tokenSymbol}
              </div>
              <div className="flex items-center text-center font-normal text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                Token
              </div>
            </div>

            {/* SECOND BLOCK */}
            <div className="sm:w-12 sm:h-12 md:w-18.75 md:h-18.75  xl: 2xl: 3xl:w-20 xl: 2xl: 3xl:h-20 flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1">
              <div className="sm:text-xs sm:leading-4 flex items-center text-center font-normal md:text-xl xl: 2xl: 3xl:text-2xl leading-8 tracking-finnieSpacing-tight">
                {balanceString}
              </div>
              <div className="flex items-center text-center font-normal text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                Balance
              </div>
            </div>

            {/* THRID BLOCK */}
            <div className="sm:w-12 sm:h-12 md:w-18.75 md:h-18.75  xl: 2xl: 3xl:w-20 xl: 2xl: 3xl:h-20 flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1">
              <div className="sm:text-xs sm:leading-4 flex items-center text-center font-normal md:text-xl xl: 2xl: 3xl:text-2xl leading-8 tracking-finnieSpacing-tight">
                {totalCoins}
              </div>
              <div className="flex items-center text-center font-normal text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {totalCoins > 1 ? 'Coins' : 'Coin'}
              </div>
            </div>
            {/* {account.type === TYPE.ARWEAVE ? (
            <div className="w-18.75 h-18.75 xl: 2xl: 3xl:w-20 xl: 2xl: 3xl:h-20 flex flex-col justify-center items-center shadow-sm bg-lightBlue rounded-1">
              <div className="flex items-center text-center font-normal text-xl xl: 2xl: 3xl:text-2xl leading-8 tracking-finnieSpacing-tight">
                {totalViews}
              </div>
              <div className="flex items-center text-center font-normal text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {chrome.i18n.getMessage('views')}
              </div>
            </div>
          ) : (
            <div
              className={clsx(
                'w-18.75 h-18.75 xl: 2xl: 3xl:w-20 xl: 2xl: 3xl:h-20 flex flex-col justify-center items-center shadow-sm bg-trueGray-400 rounded',
                'font-normal text-xs 2xl:text-sm 3xl:text-base text-center tracking-finnieSpacing-tight'
              )}
              data-tip={chrome.i18n.getMessage('views')}
            >
              {chrome.i18n.getMessage('comingSoon')}
            </div>
          )} */}
            <ToolTip />
          </div>
        </div>

        <div className="absolute sm:space-y-12 sm:h-auto md:h-40 md:space-y-0 lg:h-32 xl:h-34.75 2xl:h-37.75 3xl:h-40 flex flex-col justify-between items-center top-0 right-5 py-6">
          <div
            className="md:mt-0 flex items-center justify-center"
            onClick={() => handleChangeDisplayAccount(account)}
          >
            {isDefaultAccount(account) ? (
              <FilledStarIcon className="cursor-pointer w-5 xl:w-6 2xl:w-7 3xl:w-8 h-5 xl:h-6 2xl:h-7 3xl:h-8" />
            ) : (
              <EmptyStarIcon
                style={{ width: '20px', height: '20px' }}
                className="cursor-pointer w-5 xl:w-6 2xl:w-7 3xl:w-8 h-5 xl:h-6 2xl:h-7 3xl:h-8"
              />
            )}
          </div>
          <div
            className={clsx(
              'flex items-center justify-center bg-lightBlue shadow-sm rounded-full cursor-pointer',
              'w-6 xl:w-7 2xl:w-8 3xl:w-9 h-6 xl:h-7 2xl:h-8 3xl:h-9'
            )}
            onClick={() => setIsDrop((prev) => !prev)}
            data-testid={`account-card-drop-down-${account.address}`}
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
          className={clsx(
            'max-w-lg md:h-auto sm:py-8 sm:pb-12 md:py-8 lg:py-6 lg:h-40 xl:max-w-xl 2xl:max-w-2xl 3xl:max-w-3xl',
            'relative flex flex-wrap items-center justify-start bg-trueGray-600 px-5'
          )}
          // style={{ height: '183px' }}
        >
          <div className="sm:w-full md:w-1/2 lg:w-1/3 h-full flex flex-col gap-6">
            <div className="flex gap-2.75 items-start">
              <div className="w-1/2 flex justify-start text-left font-semibold text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {chrome.i18n.getMessage('accountBalance')}
              </div>
              <div className="flex flex-col gap-1" data-testid="account-card-account-balance">
                {tokenList.map((token, idx) => (
                  <div
                    className="font-normal text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight"
                    key={idx}
                    data-testid={`account-card-account-balance-${token.symbol}`}
                  >
                    {formatNumber(token.displayingBalance)} {token.symbol}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2.75 items-start">
              <div className="w-1/2 flex justify-start text-left font-semibold text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {chrome.i18n.getMessage('nftAssets')}
                {':'}
              </div>
              <div
                className="font-normal text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight"
                data-testid="account-card-nft-assets"
              >
                {account.totalAssets.length} {account.type === TYPE.ARWEAVE && 'AR'}
                {account.type === TYPE.ETHEREUM && get(networkMetadata, 'currencySymbol')}
                {account.type === TYPE.SOLANA && 'SOL'}
              </div>
            </div>
          </div>

          <div className="sm:w-full md:w-1/2 md:px-2 lg:w-1/3 h-full flex flex-col gap-4.5">
            <div className="w-full h-6 flex items-center justify-between">
              <div className="font-semibold text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {chrome.i18n.getMessage('network')}
                {': '}
              </div>
              <div className="w-38.75 xl:w-40 2xl:w-42.5 3xl:w-46">
                <DropdownNew
                  options={providerOptions.find((o) => o.type === account.type)?.value}
                  value={currentNetwork}
                  onChange={onNetworkChange}
                  width={150}
                  height={22}
                  style={{
                    color: 'white',
                    fontSize: '12px'
                  }}
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
              <div className="font-semibold text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {chrome.i18n.getMessage('dappConnection')}
                {': '}
              </div>
              <div
                className="text-xs 2xl:text-sm 3xl:text-base font-normal tracking-finnieSpacing-tight underline cursor-pointer"
                onClick={() => {
                  setShowConnectedSites(true)
                  setAccountConnectSites(account)
                }}
              >
                {siteConnectedAddresses.length} sites
              </div>
            </div>
          </div>

          <div className="sm:w-full md:w-1/2 lg:w-1/3 h-full flex flex-col gap-4.5">
            <div
              onClick={() => setShowRecoveryPhraseModal(true)}
              className="w-full h-6 flex justify-between items-center"
            >
              <div className="flex justify-end font-semibold text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                {chrome.i18n.getMessage('revealSecretPhraseText')}{': '}
              </div>
              <div
                className="w-6 xl:w-7 2xl:w-8 3xl:w-9 h-6 xl:h-7 2xl:h-8 3xl:h-9 bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                data-testid={`account-card-reveal-secret-phrase-${account.address}`}
              >
                <ReavealSeedphraseIcon className="w-4 xl:w-5 2xl:w-6 3xl:w-7 h-4 xl:h-5 2xl:h-6 3xl:h-7" />
              </div>
            </div>

            <div
              onClick={() => setShowQrCodeModal(true)}
              className="w-full h-6 flex items-center justify-between"
            >
              <div className="flex justify-end font-semibold text-xs 2xl:text-sm 3xl:text-base tracking-finnieSpacing-tight">
                See QR code:{' '}
              </div>
              <div className="w-6 xl:w-7 2xl:w-8 3xl:w-9 h-6 xl:h-7 2xl:h-8 3xl:h-9 bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer">
                <SeeQRIcon className="w-3 xl:w-4 2xl:w-5 3xl:w-6 h-3 xl:h-4 2xl:h-5 3xl:h-6" />
              </div>
            </div>

            {/* SEE ON EXTENSION */}
            {/* <div className="w-full h-6 flex items-center justify-between">
              <div className="w-3/4 flex justify-end font-semibold text-xs tracking-finnieSpacing-tight">
                See on extension:{' '}
              </div>
              <div
                className="w-6 xl:w-7 2xl:w-8 3xl:w-9 h-6 xl:h-7 2xl:h-8 3xl:h-9 bg-lightBlue rounded-full shadow-sm flex justify-center items-center cursor-pointer"
                style={{ width: '24px', height: '24px' }}
              >
                <SeeExtensionIcon style={{ width: '12.54px', height: '15.75px' }} />
              </div>
            </div> */}
          </div>

          <div
            className={clsx(
              'absolute bottom-2 right-5 flex items-center justify-center bg-warning-300 rounded-sm shadow cursor-pointer',
              'w-6.75 lg:bottom-2.5 xl:w-7.5 2xl:w-8.5 3xl:w-9.5 h-6.75 xl:h-7.5 2xl:h-8.5 3xl:h-9.5'
            )}
            onClick={() => {
              setShowConfirmRemoveAccount(true)
              setRemoveAccount(account)
            }}
            data-testid={`account-card-remove-account-${account.address}`}
          >
            <RecycleBinIcon
              className="w-4 xl:w-4.5 2xl:w-5 3xl:w-6 h-4.75 xl:h-5 2xl:h-6.5 3xl:h-7.5"
              style={{ width: '15.7px', height: '19px' }}
            />
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
