import React, { useEffect, useState } from 'react'
import { useDispatch, connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { useParallax } from 'react-scroll-parallax'
import isEmpty from 'lodash/isEmpty'

import FinnieIcon from 'img/popup/finnie-icon-blue.svg'
import SendIcon from 'img/popup/send-icon.svg'
import ReceiveIcon from 'img/popup/receive-icon.svg'

import { TYPE } from 'constants/accountConstants'
import { fiatCurrencyFormat, numberFormat } from 'utils'
import storage from 'services/storage'
import { setIsLoading } from 'popup/actions/loading'
import { popupBackgroundRequest as request } from 'services/request/popup'
import Select from 'finnie-v2/components/Select'

// components
import { loadAllAccounts } from 'options/actions/accounts'

// actions
import { updateEthereumProvider } from 'actions/koi'

const HomeTop = ({
  displayingAccount,
  price,
  setIsLoading,
  currentProviderAddress,
  setCurrentProviderAddress,
  updateEthereumProvider
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

      // update account state
      await dispatch(loadAllAccounts())
    } catch (error) {
      console.log('Failed to change provider', error.message)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const getCurrentProvider = async () => {
      const currentProvider = await storage.setting.get.ethereumProvider()
      setCurrentProviderAddress(currentProvider)
    }

    getCurrentProvider()
  }, [])

  return (
    <div className="relative z-20">
      <div ref={p.ref}>
        <div className="flex justify-between">
          <FinnieIcon className="" style={{ width: '54px', height: '40px' }} />
          {displayingAccount.type === TYPE.ETHEREUM && (
            <div className="mr-1.75">
              <Select
                options={providerOptions}
                value={currentProviderAddress}
                onChange={onChangeProvider}
              />
            </div>
          )}
        </div>
        {displayingAccount.type !== TYPE.ETHEREUM && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.koiBalance)} KOII
            </div>
            <div
              hidden
              className="text-base leading-8 tracking-finnieSpacing-tight"
              style={{ color: '#707070' }}
            >
              ${fiatCurrencyFormat(displayingAccount.koiBalance * price.KOI)} USD
            </div>
          </div>
        )}
        {displayingAccount.type === TYPE.ETHEREUM && (
          <div className="mt-6.5">
            <div className="text-blue-800 text-4xl tracking-finnieSpacing-tightest">
              {numberFormat(displayingAccount.balance)} ETH
            </div>
            <div
              className="text-base leading-8 tracking-finnieSpacing-tight"
              style={{ color: '#707070' }}
            >
              ${fiatCurrencyFormat(displayingAccount.balance * price.ETH)} USD
            </div>
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

export default connect(null, { updateEthereumProvider, setIsLoading })(HomeTop)
