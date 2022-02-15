import React from 'react'
import { useSelector } from 'react-redux'

import EthereumIcon from 'img/ethereum-logo.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'

import { TYPE } from 'constants/accountConstants'

export const AccountDropdown = ({ setShowAccountDropdown }) => {
  const accounts = useSelector((state) => state.accounts)

  return (
    <div className="bg-blue-600">
      {accounts.map((account, idx) => (
        <div
          className="bg-blue-600 text-white flex items-center cursor-pointer"
          key={idx}
          style={{ width: '249px', height: '45px' }}
          onClick={() => setShowAccountDropdown(false)}
        >
          {account.type === TYPE.ARWEAVE && <FinnieIcon className="ml-2.5 h-6.25 w-6.25" />}
          {account.type === TYPE.ETHEREUM && <EthereumIcon className="ml-2.5 h-6.25 w-6.25" />}
          <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
            {account.accountName}
          </div>
        </div>
      ))}
    </div>
  )
}

export default AccountDropdown
