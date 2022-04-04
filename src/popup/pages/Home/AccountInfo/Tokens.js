import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import isEmpty from 'lodash/isEmpty'

import { TYPE } from 'constants/accountConstants'
import { fiatCurrencyFormat, numberFormat } from 'utils'

import FinnieIcon from 'img/v2/koii-logos/finnie-koii-logo-blue.svg'
import EthereumIcon from 'img/v2/ethereum-logos/ethereum-logo.svg'
import ArweaveIcon from 'img/v2/arweave-logos/arweave-logo.svg'

// hooks
import useImportedTokenAddresses from 'popup/sharedHooks/useImportedTokenAddresses'

// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

// utils
import getTokenData from 'utils/getTokenData'

const Tokens = () => {
  const displayingAccount = useSelector(getDisplayingAccount)
  const price = useSelector((state) => state.price)

  const { importedTokenAddresses } = useImportedTokenAddresses({
    userAddress: displayingAccount.address
  })

  const [tokens, setTokens] = useState([])

  const loadTokenList = async () => {
    if (displayingAccount.type === TYPE.ARWEAVE) {
      setTokens([
        {
          name: 'Arweave',
          balance: numberFormat(displayingAccount.balance),
          symbol: 'AR',
          usdValue: fiatCurrencyFormat(displayingAccount.balance * price.AR)
        },
        { name: 'KOII', balance: numberFormat(displayingAccount.koiBalance), symbol: 'KOII' }
      ])
      return
    }

    const importTokens = [
      {
        name: 'Ethereum',
        balance: numberFormat(displayingAccount.balance),
        usdValue: fiatCurrencyFormat(displayingAccount.balance * price.ETH),
        symbol: 'ETH'
      }
    ]
    await Promise.all(
      importedTokenAddresses.map(async (contractAddress) => {
        let token = await getTokenData(contractAddress, displayingAccount.address)
        if (token.price) {
          token = { ...token, usdValue: fiatCurrencyFormat(token.balance * token.price) }
        }
        importTokens.push(token)
      })
    )

    setTokens(importTokens)
  }

  useEffect(() => {
    loadTokenList()
  }, [displayingAccount, importedTokenAddresses])

  const handleRefreshTokenList = async () => {
    await loadTokenList()
  }

  return (
    <div className="w-full px-3">
      {tokens.map((token, idx) => (
        <div
          key={idx}
          className={clsx(
            'w-full flex items-center justify-between px-2 py-3 text-blue-800 text-sm',
            'border-b border-trueGray-400'
          )}
        >
          <div className="flex items-center">
            {token.name === 'Ethereum' && <EthereumIcon className="w-8.75 h-8.75" />}
            {token.name === 'KOII' && <FinnieIcon className="w-8.75 h-8.75" />}
            {token.name === 'Arweave' && <ArweaveIcon className="w-8.75 h-8.75" />}
            {token.name !== 'Ethereum' && token.name !== 'KOII' && token.name !== 'Arweave' && (
              <FinnieIcon className="w-8.75 h-8.75" />
            )}
            <span className="font-semibold ml-2.75">{token.name}</span>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-semibold">
              {token.balance} {token.symbol}
            </div>
            {token.usdValue && <div>{token.usdValue} USD</div>}
          </div>
        </div>
      ))}
      <div className="mt-5 font-normal text-xs text-center tracking-finnieSpacing-wide text-blue-800">
        Don’t see your token?
      </div>
      <div className="mt-1.5 mb-4 font-normal text-xs text-center tracking-finnieSpacing-wide text-blue-800">
        <span
          className="cursor-pointer underline text-success-700"
          onClick={() => handleRefreshTokenList()}
        >
          Refresh list
        </span>{' '}
        or{' '}
        <Link className="cursor-pointer underline text-success-700" to="/import-token">
          Import a token
        </Link>
      </div>
    </div>
  )
}

export default Tokens
