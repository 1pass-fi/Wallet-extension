import React, { useState } from 'react'
import isEmpty from 'lodash/isEmpty'

import SearchIcon from 'img/popup/search-icon.svg'
import FinnieIcon from 'img/popup/finnie-icon-blue.svg'

import contracts from 'utils/contract-map.json'

const Search = ({ setTokenImport }) => {
  const [searchToken, setSearchToken] = useState('')
  const [tokenList, setTokenList] = useState([])

  const onChangeSearchToken = (e) => {
    if (e.keyCode === 13) {
      onSearchToken()
    }
  }

  const onSearchToken = async () => {
    console.log('onSearchToken', searchToken)
    if (isEmpty(searchToken)) return
    const filterTokenList = Object.keys(contracts).reduce((result, key) => {
      if (
        key === searchToken ||
        contracts[key].name?.includes(searchToken) ||
        contracts[key].symbol?.includes(searchToken)
      ) {
        // TODO LongP
        const token = {
          contract: key,
          name: contracts[key].name,
          symbol: contracts[key].symbol
        }
        result.push(token)
      }
      return result
    }, [])

    console.log('onSearchToken', filterTokenList)
    setTokenList(filterTokenList)
  }

  return (
    <div className="flex flex-col items-center justify-center mt-5.5">
      <div
        className="bg-trueGray-100 rounded border border-blue-800 flex justify-between items-center"
        style={{ width: '352px', height: '32px' }}
      >
        <input
          className="bg-trueGray-100 text-blue-800 placeholder-opacity-80 outline-none font-normal text-sm leading-6 pl-2"
          placeholder="Seach for a token"
          style={{ width: '316px' }}
          onChange={(e) => setSearchToken(e.target.value)}
          onKeyUp={(e) => onChangeSearchToken(e)}
          value={searchToken}
        ></input>
        <SearchIcon className="mr-2 cursor-pointer" onClick={() => onSearchToken()} />
      </div>

      <div
        className="mt-6.25 w-full flex flex-col pl-12.5 pr-1.5 mr-1.25 overflow-y-scroll"
        style={{ height: '300px' }}
      >
        {tokenList.map((token, idx) => (
          <div
            key={idx}
            className="flex w-full items-center mb-6 cursor-pointer"
            onClick={() => setTokenImport(token)}
          >
            <FinnieIcon style={{ width: '36px', height: '36px' }} />
            <div className="ml-3 font-normal text-base tracking-finnieSpacing-tight text-blue-800">
              {token.name + ' (' + token.symbol + ')'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Search
