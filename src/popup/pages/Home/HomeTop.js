import React, { useEffect, useState } from 'react'
import { useDispatch, connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParallax } from 'react-scroll-parallax'
import isEmpty from 'lodash/isEmpty'

import FinnieIcon from 'img/popup/finnie-icon-blue.svg'
import SendIcon from 'img/popup/send-icon.svg'
import ReceiveIcon from 'img/popup/receive-icon.svg'

// constants
import { TYPE } from 'constants/accountConstants'
import { MESSAGES } from 'constants/koiConstants'

import { fiatCurrencyFormat, numberFormat } from 'utils'
import storage from 'services/storage'
import { setIsLoading } from 'popup/actions/loading'
import { popupBackgroundRequest as request } from 'services/request/popup'
import Select from 'finnie-v2/components/Select'

// components
import { loadAllAccounts } from 'options/actions/accounts'

// actions
import {
  updateEthereumProvider,
  updateSolanaProvider,
  updateK2Provider,
  loadContent
} from 'actions/koi'
import { setActivities } from 'popup/actions/activities'

const HomeTop = ({
  displayingAccount,
  price,
  setIsLoading,
  currentProviderAddress,
  setCurrentProviderAddress,
  updateEthereumProvider,
  updateSolanaProvider,
  updateK2Provider,
  setActivities
}) => {
  const p = useParallax({
    translateX: [0, 100],
    shouldAlwaysCompleteAnimation: true,
    startScroll: 0,
    endScroll: 161
  })

  const dispatch = useDispatch()

  const providerOptions = [
    {
      label: 'ETH Mainnet',
      value: 'https://mainnet.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
    },
    {
      label: 'Rinkeby TestNet',
      value: 'https://rinkeby.infura.io/v3/f811f2257c4a4cceba5ab9044a1f03d2'
    }
  ]

  const onChangeProvider = async (value) => {
    setIsLoading(true)
    try {
      await updateEthereumProvider(value)

      setCurrentProviderAddress(value)

      // load balance
      await request.wallet.loadBalanceAsync()

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.NETWORK_CHANGED })
      })

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.CHAIN_CHANGED })
      })

      await request.activities.loadActivities()

      const activities = await storage.generic.get.allActivities()
      setActivities(activities)

      // update account state
      // TODO Thuan Ngo
      await dispatch(loadAllAccounts())
      await dispatch(loadContent())
    } catch (error) {
      console.log('Failed to change Ethereum provider', error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const k2ProviderOptions = [
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
      await request.activities.loadActivities()

      const activities = await storage.generic.get.allActivities()
      setActivities(activities)

      await request.activities.loadActivities()

      // update account state
      // TODO Thuan Ngo
      await dispatch(loadAllAccounts())
      await dispatch(loadContent())

      // update account state
      await dispatch(loadAllAccounts())
    } catch (error) {
      console.log('Failed to change K2 provider', error.message)
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
      await request.activities.loadActivities()

      const activities = await storage.generic.get.allActivities()
      setActivities(activities)

      await request.activities.loadActivities()

      // update account state
      // TODO Thuan Ngo
      await dispatch(loadAllAccounts())
      await dispatch(loadContent())

      // update account state
      await dispatch(loadAllAccounts())
    } catch (error) {
      console.log('Failed to change Solana provider', error.message)
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

  return (
    <div className="relative z-20">
      <div ref={p.ref}>
        <div className="flex justify-between">
          <FinnieIcon className="" style={{ width: '54px', height: '40px' }} />
          {displayingAccount.type === TYPE.K2 && (
            <div className="mr-1.75">
              <Select
                options={k2ProviderOptions}
                value={currentProviderAddress}
                onChange={onChangeK2Provider}
              />
            </div>
          )}
          {displayingAccount.type === TYPE.ETHEREUM && (
            <div className="mr-1.75">
              <Select
                options={providerOptions}
                value={currentProviderAddress}
                onChange={onChangeProvider}
              />
            </div>
          )}
          {displayingAccount.type === TYPE.SOLANA && (
            <div className="mr-1.75">
              <Select
                options={solanaProviderOptions}
                value={currentProviderAddress}
                onChange={onChangeSolanaProvider}
              />
            </div>
          )}
        </div>
        {displayingAccount.type === TYPE.SOLANA && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.balance / Math.pow(10, 9))} SOL
            </div>
            {currentProviderAddress?.includes('mainnet') && (
              <div
                className="text-base leading-8 tracking-finnieSpacing-tight"
                style={{ color: '#707070' }}
              >
                ${fiatCurrencyFormat((displayingAccount.balance * price.SOL) / Math.pow(10, 9))} USD
              </div>
            )}
          </div>
        )}
        {displayingAccount.type === TYPE.K2 && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
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
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.koiBalance)} KOII
            </div>
          </div>
        )}
        {displayingAccount.type === TYPE.ETHEREUM && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.balance)} ETH
            </div>
            {currentProviderAddress?.includes('mainnet') && (
              <div
                className="text-base leading-8 tracking-finnieSpacing-tight"
                style={{ color: '#707070' }}
              >
                ${fiatCurrencyFormat(displayingAccount.balance * price.ETH)} USD
              </div>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between" style={{ width: '140px' }}>
          <div className="flex flex-col items-center justify-center">
            <Link
              className="rounded-full bg-lightBlue shadow flex items-center justify-center cursor-pointer"
              style={{ width: '44px', height: '44px' }}
              to="/send"
            >
              <SendIcon style={{ width: '23px', height: '20px' }} />
            </Link>
            <div className="mt-2.25 text-center text-xs leading-3 tracking-finnieSpacing-wide">
              SEND
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Link
              className="rounded-full bg-lightBlue shadow flex items-center justify-center cursor-pointer"
              style={{ width: '44px', height: '44px' }}
              to="/receive"
            >
              <ReceiveIcon style={{ width: '23px', height: '20px' }} />
            </Link>
            <div className="mt-2.25 text-center text-xs leading-3 tracking-finnieSpacing-wide">
              RECEIVE
            </div>
          </div>
        </div>
      </div>
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
