import React from 'react'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-orange.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import SolanaLogo from 'img/v2/solana-logo.svg'
import RefreshIcon from 'img/popup/refresh-icon.svg'

import formatNumber from 'finnie-v2/utils/formatNumber'
import { TYPE } from 'constants/accountConstants'

import { popupBackgroundRequest as request } from 'services/request/popup'

const Balance = ({ account }) => {
  return (
    <div className="min-w-22.5 h-8 flex justify-between items-center pl-2 bg-white bg-opacity-20 rounded text-white shadow">
      {isEmpty(account.type) && (
        <>
          <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-3.75">0</span>
          <ArweaveLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-2">0</span>
        </>
      )}
      {account.type === TYPE.ARWEAVE && (
        <>
          <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-3.75">
            {isNumber(account.koiBalance) ? formatNumber(account.koiBalance, 2) : '0'}
          </span>
          <ArweaveLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm  mr-2">
            {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.ETHEREUM && (
        <>
          <EthereumLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-2">
            {formatNumber(account.balance, 4) !== 'NaN' ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.SOLANA && (
        <>
          <SolanaLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-2">
            {formatNumber(account.balance, 4) !== 'NaN' ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      <div
        className="bg-trueGray-100 rounded-r-lg flex items-center justify-center cursor-pointer"
        style={{ width: '32px', height: '32px' }}
        onClick={async () => await request.wallet.loadBalanceAsync()}
      >
        <RefreshIcon />
      </div>
    </div>
  )
}

export default Balance
