import React, { useEffect, useState } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParallax } from 'react-scroll-parallax'
import ReactTooltip from 'react-tooltip'
// actions
import {
  clearContent,
  updateEthereumProvider,
  updateK2Provider,
  updateSolanaProvider
} from 'actions/koi'
// constants
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'
import CheckIcon from 'img/popup/check-icon.svg'
import CopyIcon from 'img/popup/copy-icon-new.svg'
import FinnieIcon from 'img/popup/finnie-icon-blue.svg'
import PopupBackground from 'img/popup/popup-background.svg'
import ReceiveIcon from 'img/popup/receive-icon.svg'
import RefreshIcon from 'img/popup/refresh-icon.svg'
import SendIcon from 'img/popup/send-icon.svg'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
// components
import { loadAllAccounts } from 'options/actions/accounts'
import Select from 'options/components/Select'
import formatLongString from 'options/utils/formatLongString'
import { setActivities } from 'popup/actions/activities'
import { setCurrentProvider } from 'popup/actions/currentProvider'
import { setIsLoading } from 'popup/actions/loading'
import { popupBackgroundRequest as request } from 'services/request/popup'
import storage from 'services/storage'
import { useEvmNetworkMetadata } from 'sharedHooks/useNetworkMetaData'
import { fiatCurrencyFormat, numberFormat } from 'utils'

const HomeTop = ({
  displayingAccount,
  price,
  currency,
  setIsLoading,
  currentProviderAddress,
  setCurrentProviderAddress,
  updateEthereumProvider,
  updateSolanaProvider,
  updateK2Provider,
  setActivities
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const p = useParallax({
    translateX: [0, 100],
    shouldAlwaysCompleteAnimation: true,
    startScroll: 0,
    endScroll: 161
  })

  const dispatch = useDispatch()

  const networkMetadata = useSelector((state) => state.networkMetadata)

  const [evmProviderOptions, setEvmProviderOptions] = useState([
    {
      label: 'ETH Mainnet',
      value: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
    },
    {
      label: 'Goerli TestNet',
      value: 'https://goerli.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
    }
  ])

  useEffect(() => {
    const getAddedEvmNetworks = async () => {
      const addedEvmNetworks = await storage.setting.get.addedEvmNetworks()

      setEvmProviderOptions((prev) => [...prev, ...addedEvmNetworks])
    }

    getAddedEvmNetworks()
  }, [])

  const onChangeProvider = async (value) => {
    setIsLoading(true)
    try {
      await updateEthereumProvider(value)

      setCurrentProviderAddress(value)
      dispatch(setCurrentProvider(value))

      // load balance
      await request.wallet.loadBalanceAsync()

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.NETWORK_CHANGED })
      })

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.CHAIN_CHANGED })
      })

      await request.activities.loadActivities({ network: TYPE.ETHEREUM })

      const activities = await storage.generic.get.allActivities()
      setActivities(activities)

      // update account state
      // TODO Thuan Ngo
      await dispatch(loadAllAccounts())
      await dispatch(clearContent(TYPE.ETHEREUM))
    } catch (error) {
      console.error('Failed to change Ethereum provider', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const k2ProviderOptions = [
    {
      label: 'TESTNET',
      value: 'testnet'
    }
  ]

  const solanaProviderOptions = [
    {
      label: 'MAINNET',
      value: 'mainnet-beta'
    },
    {
      label: 'TESTNET',
      value: 'testnet'
    },
    {
      label: 'DEVNET',
      value: 'devnet'
    }
  ]

  const onChangeK2Provider = async (value) => {
    setIsLoading(true)
    try {
      await updateK2Provider(value)

      setCurrentProviderAddress(value)

      // load balance
      await request.wallet.loadBalanceAsync()
      await request.activities.loadActivities({ network: TYPE.K2 })

      const activities = await storage.generic.get.allActivities()
      setActivities(activities)

      // update account state
      // TODO Thuan Ngo
      await dispatch(loadAllAccounts())
      await dispatch(clearContent(TYPE.K2))
    } catch (error) {
      console.error('Failed to change K2 provider', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onChangeSolanaProvider = async (value) => {
    setIsLoading(true)
    try {
      await updateSolanaProvider(value)

      setCurrentProviderAddress(value)

      // load balance
      await request.wallet.loadBalanceAsync()
      await request.activities.loadActivities({ network: TYPE.SOLANA })

      const activities = await storage.generic.get.allActivities()
      setActivities(activities)

      // update account state
      // TODO Thuan Ngo
      await dispatch(loadAllAccounts())
      await dispatch(clearContent(TYPE.SOLANA))
    } catch (error) {
      console.error('Failed to change Solana provider', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const getCurrentProvider = async (accountType) => {
      let currentProvider
      if (accountType === TYPE.ETHEREUM) {
        currentProvider = await storage.setting.get.ethereumProvider()
      } else if (accountType === TYPE.SOLANA) {
        currentProvider = await storage.setting.get.solanaProvider()
      } else if (accountType === TYPE.K2) {
        currentProvider = await storage.setting.get.k2Provider()
      }
      setCurrentProviderAddress(currentProvider)
    }

    getCurrentProvider(displayingAccount.type)
  }, [displayingAccount])

  const goToAddNetwork = () => {
    const url = chrome.runtime.getURL('options.html#/settings/wallet?locationId=add-network')
    chrome.tabs.create({ url })
  }

  const onCopy = () => {
    setIsCopied(true)

    setTimeout(() => setIsCopied(false), 3000)
  }

  return (
    <div className="relative z-20">
      <PopupBackground
        style={{ width: '177px', height: '156px', top: '-18px' }}
        className="absolute right-0 z-0 opacity-60"
      />
      <div ref={p.ref}>
        <div className="flex justify-between">
          <div className="flex flex-row items-center">
            <FinnieIcon className="" style={{ width: '54px', height: '40px' }} />
            <div
              style={{ backgroundColor: '#DCF7F5', color: '#373762' }}
              className="flex flex-row items-center px-2 py-1 ml-3 rounded-lg"
            >
              <div className="mr-2">{formatLongString(displayingAccount.address, 13)}</div>
              <div
                onClick={async (e) => {
                  e.stopPropagation()
                  onCopy()
                  await navigator.clipboard.writeText(displayingAccount.address)
                }}
                className="cursor-pointer"
              >
                {isCopied ? <CheckIcon /> : <CopyIcon />}
              </div>
            </div>
          </div>
          {/* {displayingAccount.type === TYPE.K2 && (
            <div className="mr-1.75" data-testid="provider-dropdown">
              <Select
                options={k2ProviderOptions}
                value={currentProviderAddress}
                onChange={onChangeK2Provider}
              />
            </div>
          )} */}
          {displayingAccount.type === TYPE.ETHEREUM && (
            <div className="mr-1.75" data-testid="provider-dropdown">
              <Select
                options={evmProviderOptions}
                value={currentProviderAddress}
                onChange={onChangeProvider}
                bottomButtonLabel={'Add Network'}
                bottomButtonAction={goToAddNetwork}
              />
            </div>
          )}
          {displayingAccount.type === TYPE.SOLANA && (
            <div className="mr-1.75" data-testid="provider-dropdown">
              <Select
                options={solanaProviderOptions}
                value={currentProviderAddress}
                onChange={onChangeSolanaProvider}
              />
            </div>
          )}
        </div>
        <div className="flex items-start mt-6.5">
          {displayingAccount.type === TYPE.SOLANA && (
            <div>
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance / Math.pow(10, 9))} SOL
              </div>
              {currentProviderAddress?.includes('mainnet') && (
                <div
                  className="text-base leading-8 tracking-finnieSpacing-tight"
                  style={{ color: '#707070' }}
                >
                  {fiatCurrencyFormat((displayingAccount.balance * price.SOL) / Math.pow(10, 9))}{' '}
                  {currency}
                </div>
              )}
            </div>
          )}
          {displayingAccount.type === TYPE.K2 && (
            <div>
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance / Math.pow(10, 9))} KOII
              </div>
              {/* {currentProviderAddress?.includes('mainnet') && (
              <div
                className="text-base leading-8 tracking-finnieSpacing-tight"
                style={{ color: '#707070' }}
              >
                ${fiatCurrencyFormat((displayingAccount.balance * price.SOL) / Math.pow(10, 9))} USD
              </div>
            )} */}
            </div>
          )}
          {displayingAccount.type === TYPE.ARWEAVE && (
            <div>
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance)} AR
              </div>
            </div>
          )}
          {displayingAccount.type === TYPE.ETHEREUM && (
            <div>
              <div className="text-4xl text-blue-800 tracking-finnieSpacing-tightest">
                {numberFormat(displayingAccount.balance)} {get(networkMetadata, 'currencySymbol')}
              </div>
              {currentProviderAddress?.includes('mainnet') && (
                <div
                  className="text-base leading-8 tracking-finnieSpacing-tight"
                  style={{ color: '#707070' }}
                >
                  {fiatCurrencyFormat(displayingAccount.balance * price.ETH)} {currency}
                </div>
              )}
            </div>
          )}
          <div data-tip="Refresh balance">
            <RefreshIcon
              className="ml-2.5 mt-2.5 cursor-pointer"
              onClick={async () => await request.wallet.loadBalanceAsync()}
              data-testid="reload-balance-popup-button"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-5" style={{ width: '140px' }}>
          <Link className="flex flex-col items-center justify-center" to="/send" role="button">
            <div
              className="flex items-center justify-center rounded-full shadow cursor-pointer bg-lightBlue"
              style={{ width: '44px', height: '44px' }}
            >
              <SendIcon style={{ width: '48px', height: '48px' }} data-testid="icon-send-tokens" />
            </div>
            <div className="mt-2.25 text-center text-xs leading-3 tracking-finnieSpacing-wide">
              {chrome.i18n.getMessage('sendUc')}
            </div>
          </Link>
          <Link className="flex flex-col items-center justify-center" to="/receive" role="button">
            <div
              className="flex items-center justify-center rounded-full shadow cursor-pointer bg-lightBlue"
              style={{ width: '44px', height: '44px' }}
            >
              <ReceiveIcon style={{ width: '48px', height: '48px' }} />
            </div>
            <div className="mt-2.25 text-center text-xs leading-3 tracking-finnieSpacing-wide">
              {chrome.i18n.getMessage('receiveUc')}
            </div>
          </Link>
        </div>
        {/* {isCopied && (
          <div
            className="absolute flex items-center justify-center text-center text-blue-800 shadow-md bg-cyan rounded-3xl"
            style={{ width: '159px', height: '28px', left: '115px', top: '420px' }}
          >
            {chrome.i18n.getMessage('addressCopied')}
          </div>
        )} */}
      </div>
      <ReactTooltip place="top" effect="float" />
    </div>
  )
}

export default connect(null, {
  updateEthereumProvider,
  updateSolanaProvider,
  updateK2Provider,
  setIsLoading,
  setActivities
})(HomeTop)
