import React from 'react'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import ArrowIcon from 'img/popup/down-arrow-icon.svg'

const TokenDropdown = ({ tokenOptions, selectedToken, onChangeToken }) => {
  const currentToken = tokenOptions.find((t) => t.symbol === selectedToken)
  return (
    <div
      className="absolute top-0 right-0 flex flex-col bg-blue-800 cursor-pointer"
      style={{ width: '68px' }}
    >
      <div
        className="flex items-center justify-evenly cursor-pointer"
        style={{ height: '45px' }}
        onClick={() => onChangeToken(selectedToken)}
      >
        {selectedToken === 'AR' && <ArweaveIcon style={{ width: '35px', height: '35px' }} />}
        {selectedToken === 'ETH' && <EthereumIcon style={{ width: '33px', height: '33px' }} />}
        {selectedToken === 'KOII' && <FinnieIcon style={{ width: '34px', height: '34px' }} />}
        {selectedToken !== 'KOII' && selectedToken !== 'AR' && selectedToken !== 'ETH' && (
          <img src={currentToken.logo} style={{ width: '34px', height: '34px' }} />
        )}
        <ArrowIcon style={{ transform: 'rotateX(180deg)' }} />
      </div>
      {tokenOptions.map((token, idx) => (
        <div key={idx}>
          {token.symbol === 'AR' && token.symbol !== selectedToken && (
            <div
              className="flex items-center"
              style={{ height: '45px' }}
              onClick={() => onChangeToken(token.symbol)}
            >
              <ArweaveIcon className="ml-2" style={{ width: '35px', height: '35px' }} />
            </div>
          )}
          {token.symbol === 'ETH' && token.symbol !== selectedToken && (
            <div
              className="flex items-center"
              style={{ height: '45px' }}
              onClick={() => onChangeToken(token.symbol)}
            >
              <EthereumIcon className="ml-2" style={{ width: '33px', height: '33px' }} />
            </div>
          )}
          {token.symbol === 'KOII' && token.symbol !== selectedToken && (
            <div
              className="flex items-center"
              style={{ height: '45px' }}
              onClick={() => onChangeToken(token.symbol)}
            >
              <FinnieIcon className="ml-2" style={{ width: '34px', height: '34px' }} />
            </div>
          )}
          {token.symbol !== 'KOII' &&
            token.symbol !== 'AR' &&
            token.symbol !== 'ETH' &&
            token.symbol !== selectedToken && (
            <div
              className="flex items-center"
              style={{ height: '45px' }}
              onClick={() => onChangeToken(token.symbol)}
            >
              <img src={token.logo} className="ml-2" style={{ width: '34px', height: '34px' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default TokenDropdown
