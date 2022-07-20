import React from 'react'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import ArrowIcon from 'img/down-arrow-icon.svg'
import EthereumIcon from 'img/popup/ethereum-icon.svg'
import FinnieIcon from 'img/popup/finnie-icon.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import SolanaIcon from 'img/v2/solana-logo.svg'

import { TYPE } from 'constants/accountConstants'

// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

import formatLongString from 'finnie-v2/utils/formatLongString'

const Account = ({ showAccountDropdown, setShowAccountDropdown }) => {
  const displayingAccount = useSelector(getDisplayingAccount)

  return (
    <div
      className="bg-blue-800 flex items-center justify-between cursor-pointer select-none"
      style={{ width: '249px', height: '100%' }}
      onClick={() => {
        setShowAccountDropdown((prev) => !prev)
      }}
    >
      {isEmpty(displayingAccount?.address) ? (
        <div className="ml-3.75 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
          Select Account
        </div>
      ) : (
        <div className="ml-2.5 flex items-center">
          {displayingAccount.type === TYPE.ARWEAVE && (
            <ArweaveIcon style={{ width: '25px', height: '25px' }} />
          )}
          {displayingAccount.type === TYPE.K2 && (
            <FinnieIcon style={{ width: '25px', height: '25px' }} />
          )}
          {displayingAccount.type === TYPE.ETHEREUM && (
            <EthereumIcon style={{ width: '25px', height: '25px' }} />
          )}
          {displayingAccount.type === TYPE.SOLANA && (
            <SolanaIcon style={{ width: '25px', height: '25px' }} />
          )}
          <div className="ml-2 font-semibold text-base leading-8 tracking-finnieSpacing-tight text-white">
            {formatLongString(displayingAccount?.accountName, 12)}
          </div>
        </div>
      )}

      <ArrowIcon
        className="mr-6.5"
        style={{ transform: !showAccountDropdown ? 'none' : 'rotateX(180deg)' }}
      />
    </div>
  )
}

export default Account
