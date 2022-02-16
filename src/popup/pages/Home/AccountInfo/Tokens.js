import clsx from 'clsx'
import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'

import { TYPE } from 'constants/accountConstants'
import { fiatCurrencyFormat, numberFormat } from 'utils'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

const Tokens = () => {
  const defaultAccount = useSelector((state) => state.defaultAccount)
  const price = useSelector((state) => state.price)

  const tokens = useMemo(() => {
    if (defaultAccount.type === TYPE.ARWEAVE)
      return [
        {
          name: 'Arweave',
          value: numberFormat(defaultAccount.balance),
          unit: 'AR',
          usdValue: numberFormat(fiatCurrencyFormat(defaultAccount.balance * price.AR))
        },
        { name: 'KOII', value: numberFormat(defaultAccount.koiBalance), unit: 'KOII' }
      ]
    return [
      {
        name: 'Ethereum',
        value: numberFormat(defaultAccount.balance),
        usdValue: numberFormat(fiatCurrencyFormat(defaultAccount.balance * price.ETH)),
        unit: 'ETH'
      }
    ]
  }, [defaultAccount])

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
            {token.usdValue && <div>{token.usdValue} USD</div>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Tokens
