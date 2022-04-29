import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'

import EthereumIcon from 'img/ethereum-logo.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'
import AddIcon from 'img/popup/add-icon.svg'
import RemoveAccountIcon from 'img/remove-account-links.svg'

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

export const AccountDropdown = ({ setShowAccountDropdown, removeWallet, setIsLoading }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const accounts = useSelector((state) => state.accounts)

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

  return (
    <div className="bg-indigo-400 select-none">
      {accounts.map((account, idx) => (
        <div
          className="bg-blue-600 text-white flex items-center cursor-pointer mb-0.25 hover:bg-indigo-400"
          key={idx}
          style={{ width: '249px', height: '45px' }}
          onClick={async () => {
            await storage.setting.set.activatedChain(account.type)
            dispatch(setActivatedChain(account.type))
            dispatch(setDefaultAccount(account))
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
              chrome.tabs.sendMessage(tabs[0].id, { type: MESSAGES.ACCOUNTS_CHANGED })
            })
            setShowAccountDropdown(false)
          }}
        >
          {account.type === TYPE.ARWEAVE && <FinnieIcon className="ml-2.5 h-6.25 w-6.25" />}
          {account.type === TYPE.ETHEREUM && <EthereumIcon className="ml-2.5 h-6.25 w-6.25" />}
          <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
            {formatLongString(account.accountName, 12)}
          </div>
          <RemoveAccountIcon
            className="absolute right-5.25"
            onClick={(e) => {
              e.stopPropagation()
              handleRemoveWallet(account)
            }}
          />
        </div>
      ))}
      <div
        className="bg-blue-600 text-white flex items-center cursor-pointer hover:bg-indigo-400"
        key={'import-new-wallet'}
        style={{ width: '249px', height: '45px' }}
        onClick={() => goToSettingPage()}
      >
        <AddIcon className="ml-2.5 h-6.25 w-6.25" />
        <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
          Import New Wallet
        </div>
      </div>
    </div>
  )
}

export default connect(null, { removeWallet, setIsLoading })(AccountDropdown)
