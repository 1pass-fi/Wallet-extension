import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'

// hooks
import useGetTokenMetaData from './hooks/useGetTokenMetaData'

import WarningIcon from 'img/popup/warning-icon.svg'

const CustomToken = ({ setTokenImport }) => {
  const history = useHistory()

  const [tokenAddress, setTokenAddress] = useState('')

  const tokenData = useGetTokenMetaData({ contractAddress: tokenAddress })

  const handleImportCustomToken = () => {
    setTokenImport({
      contract: tokenAddress,
      name: tokenData.tokenName,
      symbol: tokenData.tokenSymbol,
      decimals: tokenData.tokenDecimals
    })
  }

  const isInputted =
    !isEmpty(tokenAddress) && !isEmpty(tokenData.tokenSymbol) && !isEmpty(tokenData.tokenDecimals)

  return (
    <div className="flex flex-col text-blue-850">
      <div className="mt-4 flex">
        <WarningIcon className="ml-6" style={{ width: '35px', height: '35px' }} />
        <div className="ml-3.5 font-normal text-xs" style={{ width: '329px' }}>
          Anyone can create a token, which includes fake versions of existing tokens. Always confirm
          the Token Contract Address before purchasing a custom token.
        </div>
      </div>

      <div className="mt-8 ml-9.25 font-normal text-xs">Token Contract Address</div>
      <input
        className="mx-auto mt-0.5 bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none font-normal text-sm leading-6 pl-2 rounded border border-blue-800"
        style={{ width: '352px', height: '32px' }}
        onChange={(e) => setTokenAddress(e.target.value)}
        value={tokenAddress}
      ></input>

      <div className="mt-6 ml-9.25 font-normal text-xs">Token Symbol</div>
      <input
        className="mx-auto mt-0.5 bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none font-normal text-sm leading-6 pl-2 rounded border border-blue-800 cursor-not-allowed"
        style={{ width: '352px', height: '32px' }}
        value={!isEmpty(tokenData.tokenSymbol) ? tokenData.tokenSymbol : ''}
        readOnly
      ></input>

      <div className="mt-6 ml-9.25 font-normal text-xs">Token Decimal</div>
      <input
        className="mx-auto mt-0.5 bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none font-normal text-sm leading-6 pl-2 rounded border border-blue-800 cursor-not-allowed"
        style={{ width: '352px', height: '32px' }}
        value={!isEmpty(tokenData.tokenDecimals) ? tokenData.tokenDecimals : '0'}
        readOnly
      ></input>

      <div className="mx-auto mt-8">
        <button
          onClick={() => history.goBack()}
          className="bg-white border-2 border-blue-800 rounded-sm shadow text-base leading-4 text-center text-blue-800"
          style={{ width: '160px', height: '38px' }}
        >
          Back
        </button>
        <button
          onClick={() => handleImportCustomToken()}
          className={clsx(
            'ml-6 bg-blue-800 rounded-sm shadow text-base leading-4 text-center text-white',
            !isInputted && 'cursor-not-allowed bg-opacity-80'
          )}
          style={{ width: '160px', height: '38px' }}
          disabled={!isInputted}
        >
          Continue
        </button>
      </div>
    </div>
  )
}

export default CustomToken
