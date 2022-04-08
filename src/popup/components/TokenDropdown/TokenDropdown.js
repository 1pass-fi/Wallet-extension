import React from 'react'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'
import ArrowIcon from 'img/popup/down-arrow-icon.svg'

const TokenDropdown = ({ tokenOptions, selectedToken, onChangeToken }) => {
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
        <img src={selectedToken?.logo} style={{ width: '34px', height: '34px' }} />
        <ArrowIcon style={{ transform: 'rotateX(180deg)' }} />
      </div>
      {tokenOptions.map((token, idx) => (
        <div key={idx}>
          {token !== selectedToken && (
            <div
              className="flex items-center"
              style={{ height: '45px' }}
              onClick={() => onChangeToken(token)}
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
