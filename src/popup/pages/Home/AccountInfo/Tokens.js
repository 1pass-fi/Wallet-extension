import clsx from 'clsx'
import React from 'react'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const tokens = [
  {
    name: 'Ethereum',
    value: 2.56876,
    unit: 'ETH'
  },
  { name: 'KOII', value: 136.359, unit: 'KOII' },
  { name: 'Arweave', value: 235, unit: 'AR' }
]

const Tokens = () => {
  return (
    <div className="w-full px-3">
      {tokens.map((token, idx) => (
        <div
          key={idx}
          className={clsx(
            'w-full flex items-center justify-between px-2 py-3 text-blue-800 text-sm',
            idx !== 0 && 'border-t border-trueGray-400'
          )}
        >
          <div className="flex items-center">
            {token.name === 'Ethereum' && <EthereumIcon className="w-8.75 h-8.75" />}
            {token.name === 'KOII' && <FinnieIcon className="w-8.75 h-8.75" />}
            {token.name === 'Arweave' && <ArweaveIcon className="w-8.75 h-8.75" />}
            <span className="font-semibold ml-2.75">{token.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-semibold">
              {token.value} {token.unit}
            </div>
            <div>$11.92 USD</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Tokens
