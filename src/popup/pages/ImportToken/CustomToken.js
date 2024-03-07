import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import clsx from 'clsx'
import WarningIcon from 'img/popup/warning-icon.svg'
import isEmpty from 'lodash/isEmpty'

// hooks
import useGetTokenMetaData from './hooks/useGetTokenMetaData'

const CustomToken = ({ setTokenImport }) => {
  const history = useHistory()

  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenAddressError, setTokenAddressError] = useState('')

  const tokenData = useGetTokenMetaData({ contractAddress: tokenAddress })

  const handleImportCustomToken = () => {
    setTokenImport({
      contract: tokenAddress,
      name: tokenData.tokenName,
      symbol: tokenData.tokenSymbol,
      decimals: tokenData.tokenDecimals
    })
  }

  useEffect(() => {
    if (tokenAddress.length === 0) {
      setTokenAddressError('')
      return
    }
    console.log('contractAddress:', tokenAddress, tokenData)
    if (tokenAddress.length !== 42) {
      setTokenAddressError(chrome.i18n.getMessage('invalidTokenAddress'))
    } else {
      if (tokenData.tokenSymbol) {
        setTokenAddressError('')
      } else {
        setTokenAddressError(chrome.i18n.getMessage('invalidTokenAddressNotExist'))
      }
    }
  }, [tokenAddress, tokenData.tokenSymbol])

  const isInputted =
    !isEmpty(tokenAddress) && !isEmpty(tokenData.tokenSymbol) && !isEmpty(tokenData.tokenDecimals)

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && isInputted) {
      handleImportCustomToken()
    }
  }
  return (
    <div className="flex flex-col text-blue-850">
      <div className="mt-4 flex">
        <WarningIcon className="ml-6" style={{ width: '35px', height: '35px' }} />
        <div className="ml-3.5 font-normal text-xs" style={{ width: '329px' }}>
          {chrome.i18n.getMessage('customTokenDesc')}
        </div>
      </div>

      <div className="mt-8 ml-9.25 font-normal text-xs">
        {chrome.i18n.getMessage('tokenContractAddress')}
      </div>
      <input
        className={clsx(
          'mx-auto mt-0.5 bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none',
          'font-normal text-sm leading-6 pl-2 rounded border border-blue-800'
        )}
        style={{ width: '352px', height: '32px' }}
        onChange={(e) => {
          setTokenAddress(e.target.value)
        }}
        value={tokenAddress}
        onKeyDown={(e) => handleKeyDown(e)}
      ></input>
      <div className="mt-0.5 text-red-finnie ml-9.25 text-2xs font-normal h-2">
        {tokenAddressError}
      </div>

      <div className="mt-3 ml-9.25 font-normal text-xs">
        {chrome.i18n.getMessage('tokenSymbol')}
      </div>
      <input
        className={clsx(
          'mx-auto mt-0.5 bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none',
          'font-normal text-sm leading-6 pl-2 rounded border border-blue-800 cursor-not-allowed'
        )}
        style={{ width: '352px', height: '32px' }}
        value={!isEmpty(tokenData.tokenSymbol) ? tokenData.tokenSymbol : ''}
        readOnly
      ></input>

      <div className="mt-6 ml-9.25 font-normal text-xs">Token Decimal</div>
      <input
        className={clsx(
          'mx-auto mt-0.5 bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none',
          'font-normal text-sm leading-6 pl-2 rounded border border-blue-800 cursor-not-allowed'
        )}
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
          {chrome.i18n.getMessage('back')}
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
          {chrome.i18n.getMessage('continue')}
        </button>
      </div>
    </div>
  )
}

export default CustomToken
