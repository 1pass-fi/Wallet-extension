import React, { useState } from 'react'

import EthereumLogo from 'img/chain/ethereum-logo.svg'
import KoiIcon from 'img/finnie-koi-logo-white.svg'

import './index.css'

export default () => {
  const typeList = ['Ethereum', 'Arweave']
  const [selectedType, setSelectedType] = useState('')

  const component = () =>
    selectedType ? (
      <></>
    ) : (
      <div className='wallet-type-select-wrapper'>
        <div className='wallet-type-select'>
          <div className='title'>What is your wallet type?</div>
          {typeList.map((type_) => (
            <div
              key={type_}
              className='options'
              onClick={() => setSelectedType(type_)}
            >
              {type_}
            </div>
          ))}
        </div>
      </div>
    )

  return {
    WalletTypeSelection: component,
    selectedType,
  }
}
