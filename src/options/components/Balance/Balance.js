import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { TYPE } from 'constants/accountConstants'
import ViewsIcon from 'img/navbar/views-icon.svg'
import RefreshIcon from 'img/popup/refresh-icon.svg'
import ArweaveLogo from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumLogo from 'img/v2/ethereum-logos/ethereum-logo.svg'
// import KoiiLogo from 'img/v2/koii-logos/finnie-koii-logo-bg-white.svg'
import K2Logo from 'img/v2/k2-logos/finnie-k2-logo.svg'
import SolanaLogo from 'img/v2/solana-logo.svg'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import isNumber from 'lodash/isNumber'
import formatLongString from 'options/utils/formatLongString'
import formatNumber from 'options/utils/formatNumber'
import useNetworkLogo from 'popup/provider/hooks/useNetworkLogo'
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

  const networkMetadata = useSelector(state => state.networkMetadata)
  const { networkLogo } = useNetworkLogo({ networkName: get(networkMetadata, 'networkName') })

  return (
    <div
      className="flex justify-between items-center bg-white bg-opacity-20 rounded text-white shadow h-8 3xl:h-12"
      // style={{ maxWidth: '310px' }}
    >
      {isEmpty(account.type) && (
        <>
          <ViewsIcon style={{ width: '26px', height: '24px' }} className="mx-2" />
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">0</span>
          <K2Logo className="w-6 3xl:w-8 h-6 3xl:h-8 mr-2" />
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">0</span>
        </>
      )}
      {!isEmpty(account.accountName) && (
        <div
          className="ml-3 mr-1 font-normal text-sm 3xl:text-base leading-4 text-left tracking-finnieSpacing-wider text-trueGray-100"
          style={{ maxWidth: '150px' }}
        >
          {formatLongString(account.accountName, 10)}
        </div>
      )}
      {account.type === TYPE.ARWEAVE && (
        <>
          <ViewsIcon className="mx-2 w-6.5 3xl:w-9 h-6 3xl:h-8" />
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">{totalViews}</span>
          {/* <KoiiLogo className="w-6 h-6 mr-2" />
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">
            {isNumber(account.koiBalance) ? formatNumber(account.koiBalance, 2) : '0'}
          </span> */}
          <ArweaveLogo className="w-6 3xl:w-8 h-6 3xl:h-8 mr-2" />
          <span className="font-semibold text-sm 3xl:text-base  mr-2">
            {isNumber(account.balance) ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.K2 && (
        <>
          <K2Logo className="w-6 3xl:w-8 h-6 3xl:h-8 mx-2" />
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">
            {formatNumber(account.balance, 4) !== 'NaN'
              ? formatNumber(account.balance / Math.pow(10, 9), 4)
              : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.ETHEREUM && (
        <>
          <div className="w-6 3xl:w-8 h-6 3xl:h-8 mx-2">{networkLogo}</div>
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">
            {formatNumber(account.balance, 4) !== 'NaN' ? formatNumber(account.balance, 4) : '0'}
          </span>
        </>
      )}
      {account.type === TYPE.SOLANA && (
        <>
          <SolanaLogo className="w-6 3xl:w-8 h-6 3xl:h-8 mx-2" />
          <span className="font-semibold text-sm 3xl:text-base mr-2.5">
            {formatNumber(account.balance, 4) !== 'NaN'
              ? formatNumber(account.balance / Math.pow(10, 9), 4)
              : '0'}
          </span>
        </>
      )}
      <div
        className="bg-trueGray-100 rounded-r-lg flex items-center justify-center cursor-pointer w-8 3xl:w-12 h-8 3xl:h-12"
        onClick={async () => await request.wallet.loadBalanceAsync()}
      >
        <RefreshIcon />
      </div>
    </div>
  )
}

export default Balance
