import React from 'react'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-orange.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'

import formatNumber from 'finnie-v2/utils/formatNumber'
import { TYPE } from 'constants/accountConstants'

const Balance = ({ account }) => {
  return (
    <div className="min-w-22.5 h-8 flex justify-between items-center px-2 bg-white bg-opacity-20 rounded text-white shadow">
      {isEmpty(account.type) && (
        <>
          <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-3.75">0</span>
          <ArweaveLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm">0</span>
        </>
      )}
      {account.type === TYPE.ARWEAVE && (
        <>
          <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-3.75">
            {isNumber(account.koiBalance) ? formatNumber(account.koiBalance, 2) : '0'}
          </span>
          <ArweaveLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm">
            {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.ETHEREUM && (
        <>
          <EthereumLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm">
            {formatNumber(account.balance, 4) === 'NaN' ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
    </div>
  )
}

export default Balance
