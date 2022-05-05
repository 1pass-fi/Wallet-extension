import { TokenListProvider } from '@solana/spl-token-registry'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import isEmpty from 'lodash/isEmpty'

import SearchIcon from 'img/popup/search-icon.svg'

import contracts from 'utils/contract-map.json'

// selectors
import { getDisplayingAccount } from 'popup/selectors/displayingAccount'

// utils
import { getLogoPath } from 'utils/getTokenData'
import { TYPE } from 'constants/accountConstants'

const Search = ({ setTokenImport, searchToken, setSearchToken }) => {
  const displayingAccount = useSelector(getDisplayingAccount)

  const [solanaTokenList, setSolanaTokenList] = useState([])
  const [tokenList, setTokenList] = useState([])

  useEffect(() => {
    if (displayingAccount.type === TYPE.SOLANA) {
      const loadSolTokens = async () => {
        const tokens = await new TokenListProvider().resolve()
        setSolanaTokenList(tokens.filterByClusterSlug('mainnet-beta').getList())
      }

      loadSolTokens()
    }
  }, [displayingAccount.type])

  useEffect(() => {
    const onSearchToken = async () => {
      if (isEmpty(searchToken)) {
        setTokenList([])
        return
      }

      let filterTokenList = []

      if (displayingAccount.type === TYPE.ETHEREUM) {
        filterTokenList = Object.keys(contracts).reduce((result, key) => {
          if (
            key === searchToken ||
            contracts[key].name?.toLowerCase().includes(searchToken.toLowerCase()) ||
            contracts[key].symbol?.toLowerCase().includes(searchToken.toLowerCase())
          ) {
            const token = {
              contract: key,
              name: contracts[key].name,
              symbol: contracts[key].symbol,
              decimals: contracts[key].decimals,
              logo: contracts[key].logo
            }
            result.push(token)
          }
          return result
        }, [])
      }

      if (displayingAccount.type === TYPE.SOLANA) {
        filterTokenList = solanaTokenList
          .filter(
            (token) =>
              token.address === searchToken ||
              token.name?.toLowerCase().includes(searchToken.toLowerCase()) ||
              token.symbol?.toLowerCase().includes(searchToken.toLowerCase())
          )
          .map((token) => ({
            ...token,
            contract: token.address
          }))
      }

      setTokenList(filterTokenList)
    }

    onSearchToken()
  }, [searchToken, displayingAccount.type])

  const customTokenIconPath = useMemo(
    () => `img/v2/custom-tokens/custom-token-${Math.floor(Math.random() * 5)}.svg`,
    []
  )

  return (
    <div className="flex flex-col items-center justify-center mt-5">
      <div
        className="bg-trueGray-100 rounded border border-blue-800 flex justify-between items-center"
        style={{ width: '352px', height: '32px' }}
      >
        <input
          className="bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none font-normal text-sm leading-6 pl-2"
          placeholder="Seach for a token"
          style={{ width: '316px' }}
          onChange={(e) => setSearchToken(e.target.value)}
          value={searchToken}
        ></input>
        <SearchIcon className="mr-2 cursor-pointer" onClick={() => onSearchToken()} />
      </div>

      <div
        className="mt-6.25 w-full flex flex-col pr-1.5 mr-1.25 overflow-y-scroll overflow-x-hidden"
        style={{ width: '352px', height: '290px' }}
      >
        {tokenList.map((token, idx) => (
          <div
            key={idx}
            className="flex w-full items-center ml-2 mb-6 cursor-pointer"
            onClick={() => setTokenImport(token)}
          >
            {token.logoURI && <img src={token.logoURI} style={{ width: '36px', height: '36px' }} />}
            {token.logo && (
              <img src={getLogoPath(token.logo)} style={{ width: '36px', height: '36px' }} />
            )}
            {!token.logoURI && !token.logo && (
              <img src={customTokenIconPath} style={{ width: '36px', height: '36px' }} />
            )}

            <div className="w-full flex ml-3 font-normal text-base tracking-finnieSpacing-tight text-blue-800">
              <span className="truncate" style={{ maxWidth: '220px' }}>
                {token.name}
              </span>
              &nbsp;
              {'(' + token.symbol + ')'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
