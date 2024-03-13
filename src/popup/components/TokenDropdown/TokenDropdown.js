import React, { useMemo } from 'react'
import ArrowIcon from 'img/popup/down-arrow-icon.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import isEqual from 'lodash/isEqual'

const TokenDropdown = ({ tokenOptions, selectedToken, onChangeToken, customTokenIconPath }) => {
  return (
    <div
      className="absolute top-0 right-0 flex flex-col bg-blue-800 cursor-pointer"
      style={{ width: '68px' }}
      role="menu"
    >
      <div
        className="flex items-center justify-evenly cursor-pointer"
        style={{ height: '45px' }}
        onClick={() => onChangeToken(selectedToken)}
        role="option"
        data-testid={selectedToken?.symbol}
      >
        {selectedToken?.logo ? (
          <img src={selectedToken.logo} style={{ width: '34px', height: '34px' }} />
        ) : (
          // <FinnieIcon style={{ width: '34px', height: '34px' }} />
          <img src={customTokenIconPath} style={{ width: '34px', height: '34px' }} />
        )}
        <ArrowIcon style={{ transform: 'rotateX(180deg)' }} />
      </div>
      {tokenOptions.map((token, idx) => {
        if (!isEqual(token.symbol, selectedToken.symbol))
          return (
            <div
              key={idx}
              className="flex items-center"
              style={{ height: '45px' }}
              onClick={() => onChangeToken(token)}
              data-testid={token.symbol}
              role="option"
            >
              {token?.logo ? (
                <img src={token.logo} className="ml-2" style={{ width: '34px', height: '34px' }} />
              ) : (
                // <FinnieIcon className="ml-2" style={{ width: '34px', height: '34px' }} />
                <img
                  src={customTokenIconPath}
                  className="ml-2"
                  style={{ width: '34px', height: '34px' }}
                />
              )}
            </div>
          )
      })}
    </div>
  )
}

export default TokenDropdown
