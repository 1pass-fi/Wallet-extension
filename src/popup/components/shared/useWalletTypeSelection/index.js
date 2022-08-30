// modules
import React, { useState } from 'react'
// constants
import { TYPE } from 'constants/accountConstants'

// styles
import './index.css'


export default () => {
  const typeList = [TYPE.ARWEAVE, TYPE.ETHEREUM]
  const [selectedType, setSelectedType] = useState('')

  const component = () =>
    selectedType ? (
      <></>
    ) : (
      <div className='wallet-type-select-wrapper'>
        <div className='wallet-type-select'>
          <div className='title'>Select chain:</div>
          {typeList.map((type_) => (
            <div
              key={type_}
              className='options'
              onClick={() => setSelectedType(type_)}
            >
              {type_ == TYPE.ARWEAVE ? 'ARWEAVE' : 'ETHEREUM'}
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
