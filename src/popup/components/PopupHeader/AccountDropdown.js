import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import EthereumIcon from 'img/ethereum-logo.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'
import AddIcon from 'img/popup/add-icon.svg'

import { setDefaultAccount } from 'actions/defaultAccount'
import { TYPE } from 'constants/accountConstants'

export const AccountDropdown = ({ setShowAccountDropdown }) => {
  const accounts = useSelector((state) => state.accounts)
  const dispatch = useDispatch()

  const goToSettingPage = () => {
    const url = chrome.extension.getURL('options.html#/settings/wallet')
    chrome.tabs.create({ url })
  }

  return (
    <div className="bg-indigo-400">
      {accounts.map((account, idx) => (
        <div
          className="bg-blue-600 text-white flex items-center cursor-pointer mb-0.25 hover:bg-indigo-400"
          key={idx}
          style={{ width: '249px', height: '45px' }}
          onClick={() => {
            dispatch(setDefaultAccount(account))
            setShowAccountDropdown(false)
          }}
        >
          {account.type === TYPE.ARWEAVE && <FinnieIcon className="ml-2.5 h-6.25 w-6.25" />}
          {account.type === TYPE.ETHEREUM && <EthereumIcon className="ml-2.5 h-6.25 w-6.25" />}
          <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
            {account.accountName}
          </div>
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

export default AccountDropdown
