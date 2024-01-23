import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setActivatedChain } from 'actions/activatedChain'
import { setDefaultAccount } from 'actions/defaultAccount'
// actions
import { removeWallet } from 'actions/koi'
import { setIsLoading } from 'actions/loading'
import clsx from 'clsx'
import { TYPE } from 'constants/accountConstants'
// constants
import { MESSAGES, PATH } from 'constants/koiConstants'
import EvmLogo from 'img/evm-logo.svg'
import AddIcon from 'img/popup/add-icon-new.svg'
// import AddIcon from 'img/popup/add-icon.svg'
import CopyIcon from 'img/popup/copy-icon.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'
import EmptyStarIcon from 'img/popup/star-empty-icon.svg'
import FilledStarIcon from 'img/popup/star-filled-icon.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import EditIcon from 'img/v2/edit-icon-white.svg'
import K2Icon from 'img/v2/k2-logos/finnie-k2-logo.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'
import get from 'lodash/get'
// utils
import formatLongString from 'options/utils/formatLongString'
import formatNumber from 'options/utils/formatNumber'
// services
import { popupAccount } from 'services/account'
// storage
import storage from 'services/storage'
import { numberFormat } from 'utils'

export const AccountDropdown = React.forwardRef(
  ({ setShowAccountDropdown, removeWallet, setIsLoading }, accountDropdownRef) => {
    const dispatch = useDispatch()
    const history = useHistory()

    const accounts = useSelector((state) => state.accounts)
    const defaultArweaveAccountAddress = useSelector((state) => state.defaultAccount.AR?.address)
    const defaultK2AccountAddress = useSelector((state) => state.defaultAccount.K2?.address)
    const defaultEthereumAccountAddress = useSelector((state) => state.defaultAccount.ETH?.address)
    const defaultSolanaAccountAddress = useSelector((state) => state.defaultAccount.SOL?.address)
    const networkMetadata = useSelector((state) => state.networkMetadata)

    const goToImportPages = () => {
      const url = chrome.runtime.getURL('options.html#/welcome')
      chrome.tabs.create({ url })
    }

    const goToSettingPage = () => {
      const url = chrome.runtime.getURL('options.html#/settings/wallet')
      chrome.tabs.create({ url })
    }

    const goToWelcomePage = () => {
      const url = chrome.runtime.getURL('options.html#/welcome')
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

    return (
      <div style={{ width: '341px' }} ref={accountDropdownRef}>
        <div
          className="overflow-x-hidden overflow-y-auto bg-indigo-400 select-none"
          style={{ maxHeight: '438px' }}
          data-testid="popup-header-account-dropdown"
        >
          {accounts.map((account, idx) => {
            return (
              <div
                className={clsx(
                  'flex items-start bg-blue-600 text-white cursor-pointer py-3 hover:bg-indigo-400',
                  idx !== 0 && 'mt-0.25'
                )}
                key={idx}
                style={{ height: '108px' }}
                onClick={() => handleChangeDisplayAccount(account)}
                data-testid="popup-header-account"
              >
                <div className="ml-2 mr-4">
                  {account.type === TYPE.ARWEAVE && (
                    <ArweaveIcon className="ml-2.5 mt-1 h-6.25 w-6.25" />
                  )}
                  {account.type === TYPE.K2 && <K2Icon className="ml-2.5 mt-1 h-6.25 w-6.25" />}
                  {account.type === TYPE.ETHEREUM && (
                    <EvmLogo className="ml-2.5 mt-1 h-6.25 w-6.25" />
                  )}
                  {account.type === TYPE.SOLANA && <SolanaIcon className="ml-2.5 h-6.25 w-6.25" />}
                </div>

                <div className="flex flex-col mr-24" style={{ width: '154px' }}>
                  <div
                    className="text-base font-semibold text-white tracking-finnieSpacing-tight"
                    data-testid="popup-header-account-name"
                  >
                    {formatLongString(account.accountName, 12)}
                  </div>
                  <div className="flex items-center justify-between font-normal leading-4 text-2xs tracking-finnieSpacing-tight text-turquoiseBlue">
                    <span
                      style={{ width: '140px' }}
                      className="break-all"
                      data-testid="popup-header-account-address"
                    >
                      {formatLongString(account.address, 20, true)}
                    </span>
                    <CopyIcon
                      onClick={async (e) => {
                        e.stopPropagation()
                        onCopy()
                        await navigator.clipboard.writeText(account.address)
                      }}
                      className="cursor-pointer focus:outline-none"
                      style={{ width: '13px', height: '13px' }}
                      data-testid="copy-address-icon"
                    />
                  </div>
                  {account.type === TYPE.ARWEAVE && (
                    <div
                      className="text-xs font-normal leading-6 text-white tracking-finnieSpacing-tight"
                      data-testid="popup-header-account-balance"
                    >
                      {chrome.i18n.getMessage('balance')}: {formatNumber(account.balance, 2)} AR
                    </div>
                  )}
                  {account.type === TYPE.K2 && (
                    <div
                      className="text-xs font-normal leading-6 text-white tracking-finnieSpacing-tight"
                      data-testid="popup-header-account-balance"
                    >
                      {chrome.i18n.getMessage('balance')}:{' '}
                      {formatNumber(account.balance / Math.pow(10, 9), 2)} KOII
                    </div>
                  )}
                  {account.type === TYPE.ETHEREUM && (
                    <div
                      className="text-xs font-normal leading-6 text-white tracking-finnieSpacing-tight"
                      data-testid="popup-header-account-balance"
                    >
                      {chrome.i18n.getMessage('balance')}: {formatNumber(account.balance, 2)}{' '}
                      {get(networkMetadata, 'currencySymbol')}
                    </div>
                  )}
                  {account.type === TYPE.SOLANA && (
                    <div
                      className="text-xs font-normal leading-6 text-white tracking-finnieSpacing-tight"
                      data-testid="popup-header-account-balance"
                    >
                      {chrome.i18n.getMessage('balance')}:{' '}
                      {formatNumber(account.balance / Math.pow(10, 9), 2)} SOL
                    </div>
                  )}
                  <div
                    className="text-xs font-normal leading-4 text-white tracking-finnieSpacing-tight"
                    data-testid="popup-header-account-assets"
                  >
                    {chrome.i18n.getMessage('assets')}: {account.totalAssets.length}
                  </div>
                </div>
                {isDefaultAccount(account) ? (
                  <FilledStarIcon className="mt-1 mr-4" style={{ width: '15px', height: '14px' }} />
                ) : (
                  <EmptyStarIcon className="mt-1 mr-4" style={{ width: '15px', height: '14px' }} />
                )}
              </div>
            )
          })}
        </div>
        <div
          className="w-full text-xs font-normal leading-8 text-center text-white cursor-pointer bg-indigo tracking-finnieSpacing-tight"
          key={'edit-accounts'}
          style={{ height: '44px' }}
          onClick={() => goToWelcomePage()}
        >
          <div className="flex flex-row items-center justify-center h-full">
            <AddIcon />
            <div className="ml-2 text-sm font-normal">Add Account</div>
          </div>
        </div>

        {isCopied && (
          <div
            className="absolute flex items-center justify-center text-center text-blue-800 shadow-md bg-cyan rounded-3xl"
            style={{ width: '159px', height: '28px', left: '133px', top: '499px' }}
          >
            {chrome.i18n.getMessage('addressCopied')}
          </div>
        )}
      </div>
    )
  }
)

export default connect(null, { removeWallet, setIsLoading }, null, { forwardRef: true })(
  AccountDropdown
)
