import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import clsx from 'clsx'

import EthereumIcon from 'img/ethereum-logo.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'
import AddIcon from 'img/popup/add-icon.svg'
import CopyIcon from 'img/popup/copy-icon.svg'
import EditIcon from 'img/v2/edit-icon-white.svg'
import FilledStarIcon from 'img/popup/star-filled-icon.svg'
import EmptyStarIcon from 'img/popup/star-empty-icon.svg'

// actions
import { removeWallet } from 'actions/koi'
import { setIsLoading } from 'actions/loading'
import { setDefaultAccount } from 'actions/defaultAccount'
import { setActivatedChain } from 'actions/activatedChain'

// services
import { popupAccount } from 'services/account'

// storage
import storage from 'services/storage'

// constants
import { MESSAGES, PATH } from 'constants/koiConstants'
import { TYPE } from 'constants/accountConstants'

// utils
import formatLongString from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import { numberFormat } from 'utils'

export const AccountDropdown = React.forwardRef(
  ({ setShowAccountDropdown, removeWallet, setIsLoading }, accountDropdownRef) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const accounts = useSelector((state) => state.accounts)
    const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
    const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)
    const defaultSolanaAccountAddress = useSelector((state) => state.defaultAccount.SOL?.address)

    const goToImportPages = () => {
      const url = chrome.extension.getURL('options.html#/welcome')
      chrome.tabs.create({ url })
    }

    const goToSettingPage = () => {
      const url = chrome.extension.getURL('options.html#/settings/wallet')
      chrome.tabs.create({ url })
    }

    const handleRemoveWallet = async (account) => {
      try {
        setIsLoading(true)
        await removeWallet(account.address, account.type)
        setIsLoading(false)

        // if remove the last wallet, redirect to welcome screen
        const totalAccount = await popupAccount.count()
        if (totalAccount == 0) history.push(PATH.WELCOME)
      } catch (err) {
        setIsLoading(false)
        console.log('Remove wallet - Error: ', err.message)
      }
    }

    const [isCopied, setIsCopied] = useState(false)
    const onCopy = () => {
      setIsCopied(true)

      setTimeout(() => setIsCopied(false), 3000)
    }

    const handleChangeDisplayAccount = async (account) => {
      await storage.setting.set.activatedChain(account.type)
      dispatch(setActivatedChain(account.type))
      dispatch(setDefaultAccount(account))
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
      })
      // setShowAccountDropdown(false)
      history.push('/tokens')
      setShowAccountDropdown(false)
    }

    const isDefaultAccount = (account) => {
      switch (account.type) {
        case TYPE.ARWEAVE:
          return account.address === defaultArweaveAccountAddress
        case TYPE.ETHEREUM:
          return account.address === defaultEthereumAccountAddress
        case TYPE.SOLANA:
          return account.address === defaultSolanaAccountAddress
        default:
          return false
      }
    }

    return (
      <div style={{ width: '249px' }} ref={accountDropdownRef}>
        <div
          className="bg-indigo-400 select-none overflow-y-auto overflow-x-hidden"
          style={{ maxHeight: '438px' }}
        >
          {accounts.map((account, idx) => (
            <div
              className={clsx(
                'flex items-start justify-between bg-blue-600 text-white cursor-pointer py-3 hover:bg-indigo-400',
                idx !== 0 && 'mt-0.25'
              )}
              key={idx}
              style={{ height: '108px' }}
              onClick={() => handleChangeDisplayAccount(account)}
            >
              {account.type === TYPE.ARWEAVE && (
                <FinnieIcon className="ml-2.5 mt-1 h-6.25 w-6.25" />
              )}
              {account.type === TYPE.ETHEREUM && (
                <EthereumIcon className="ml-2.5 mt-1 h-6.25 w-6.25" />
              )}
              {account.type === TYPE.SOLANA && <SolanaIcon className="ml-2.5 h-6.25 w-6.25" />}
              <div className="flex flex-col" style={{ width: '154px' }}>
                <div className="font-semibold text-base tracking-finnieSpacing-tight text-white">
                  {formatLongString(account.accountName, 12)}
                </div>
                <div className="font-normal text-2xs leading-4 tracking-finnieSpacing-tight text-turquoiseBlue flex justify-between items-center">
                  <span style={{ width: '140px' }} className="break-all">
                    {formatLongString(account.address, 20, true)}
                  </span>
                  <CopyIcon
                    onClick={(e) => {
                      e.stopPropagation()
                      onCopy()
                      navigator.clipboard.writeText(account.address)
                    }}
                    className="cursor-pointer focus:outline-none"
                    style={{ width: '13px', height: '13px' }}
                  />
                </div>
                {account.type === TYPE.ARWEAVE && (
                  <div className="font-normal text-xs leading-6 tracking-finnieSpacing-tight text-white">
                    Balance: {formatNumber(account.koiBalance, 2)} KOII
                  </div>
                )}
                {account.type === TYPE.ETHEREUM && (
                  <div className="font-normal text-xs leading-6 tracking-finnieSpacing-tight text-white">
                    Balance: {formatNumber(account.balance, 2)} ETH
                  </div>
                )}
                {account.type === TYPE.SOLANA && (
                  <div className="font-normal text-xs leading-6 tracking-finnieSpacing-tight text-white">
                    Balance: {formatNumber(account.balance / Math.pow(10, 9), 2)} SOL
                  </div>
                )}
                <div className="font-normal text-xs leading-4 tracking-finnieSpacing-tight text-white">
                  Assets: {account.totalAssets.length}
                </div>
              </div>
              {isDefaultAccount(account) ? (
                <FilledStarIcon className="mr-4 mt-1" style={{ width: '15px', height: '14px' }} />
              ) : (
                <EmptyStarIcon className="mr-4 mt-1" style={{ width: '15px', height: '14px' }} />
              )}
            </div>
          ))}
        </div>
        <div
          className="w-full bg-indigo cursor-pointer text-center underline font-normal text-xs leading-8 tracking-finnieSpacing-tight text-white"
          key={'edit-accounts'}
          style={{ height: '26px' }}
          onClick={() => goToSettingPage()}
        >
          Edit Accounts
        </div>

        {isCopied && (
          <div
            className="absolute bg-cyan text-blue-800 rounded-3xl shadow-md text-center flex items-center justify-center"
            style={{ width: '159px', height: '28px', left: '133px', top: '499px' }}
          >
            Address copied
          </div>
        )}
      </div>
    )
  }
)

export default connect(null, { removeWallet, setIsLoading }, null, { forwardRef: true })(
  AccountDropdown
)
