import React, { useEffect, useState } from 'react'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'

import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-bg-white.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
import SolanaLogo from 'img/v2/solana-logo.svg'
import RefreshIcon from 'img/popup/refresh-icon.svg'
import ViewsIcon from 'img/navbar/views-icon.svg'

import formatLongString from 'finnie-v2/utils/formatLongString'
import formatNumber from 'finnie-v2/utils/formatNumber'
import { TYPE } from 'constants/accountConstants'

import { popupBackgroundRequest as request } from 'services/request/popup'

const Balance = ({ account }) => {
  const [totalViews, setTotalViews] = useState(0)

  useEffect(() => {
    const countTotalViews = () => {
      let totalAssetViews = 0
      if (account.type === TYPE.ARWEAVE) {
        for (let asset of account.totalAssets) {
          totalAssetViews += asset.totalViews
        }
      }
      setTotalViews(totalAssetViews)
    }

    countTotalViews()
  }, [account])

  return (
    <div
      className="flex justify-between items-center bg-white bg-opacity-20 rounded text-white shadow"
      style={{ maxWidth: '310px', height: '32px' }}
    >
      {isEmpty(account.type) && (
        <>
          <ViewsIcon style={{ width: '26px', height: '24px' }} className="mx-2" />
          <span className="font-semibold text-sm mr-2.5">0</span>
          <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-2.5">0</span>
        </>
      )}
      {!isEmpty(account.accountName) && (
        <div
          className="ml-3 mr-1 font-normal text-sm leading-4 text-left tracking-finnieSpacing-wider text-trueGray-100"
          style={{ maxWidth: '150px' }}
        >
          {formatLongString(account.accountName, 10)}
        </div>
      )}
      {account.type === TYPE.ARWEAVE && (
        <>
          <ViewsIcon style={{ width: '26px', height: '24px' }} className="mx-2" />
          <span className="font-semibold text-sm mr-2.5">{totalViews}</span>
          {/* <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm mr-2.5">
            {isNumber(account.koiBalance) ? formatNumber(account.koiBalance, 2) : '0'}
          </span> */}
          <ArweaveLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm  mr-2">
            {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.K2 && (
        <>
          <KoiiLogo className="w-6 h-6 mx-2" />
          <span className="font-semibold text-sm mr-2.5">
            {formatNumber(account.balance, 4) !== 'NaN'
              ? formatNumber(account.balance / Math.pow(10, 9), 4)
              : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.ETHEREUM && (
        <>
          <EthereumLogo className="w-6 h-6 mx-2" />
          <span className="font-semibold text-sm mr-2.5">
            {formatNumber(account.balance, 4) !== 'NaN' ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.SOLANA && (
        <>
          <SolanaLogo className="w-6 h-6 mx-2" />
          <span className="font-semibold text-sm mr-2.5">
            {formatNumber(account.balance, 4) !== 'NaN'
              ? formatNumber(account.balance / Math.pow(10, 9), 4)
              : '0'}
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
