import React from 'react'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const TokenDropdown = ({ tokenOptions, selectedToken, setShowTokenOptions, setSelectedToken }) => {
  console.log({ tokenOptions })
  console.log({ selectedToken })
  return (
    <div
      className="absolute top-0 right-0 bg-blue-800 flex items-center justify-evenly cursor-pointer"
      style={{ width: '68px' }}
    >
      <div style={{ height: '45px' }}>
        {selectedToken === 'AR' && <ArweaveIcon style={{ width: '35px', height: '35px' }} />}
        {selectedToken === 'ETH' && <EthereumIcon style={{ width: '33px', height: '33px' }} />}
        {selectedToken === 'KOII' && <FinnieIcon style={{ width: '34px', height: '34px' }} />}
      </div>
      {tokenOptions.map((token, idx) => (
        <div key={idx} style={{ height: '45px' }}>
          {token}
          {token === 'AR' && <ArweaveIcon style={{ width: '35px', height: '35px' }} />}
          {token === 'ETH' && <EthereumIcon style={{ width: '33px', height: '33px' }} />}
          {token === 'KOII' && <FinnieIcon style={{ width: '34px', height: '34px' }} />}
        </div>
      ))}
    </div>
  )
}

export default TokenDropdown
