import React from 'react'
import data from 'currency-codes/data'
import getSymbolFromCurrency from 'currency-symbol-map'

import './index.css'

const mockAccount = [
  {
    id: 1,
    name: 'account #1',
    address: '1234567890123456789012345678901234',
  },
  {
    id: 2,
    name: 'account #2',
    address: '6789012341234567890123456789012345',
  },
  {
    id: 3,
    name: 'account #3',
    address: '1234567890123456789012345679999999',
  },
]

export default ({ account = mockAccount }) => {
  const onCurrencyChange = (e) => {
    console.log(e.target.value)
  }

  return (
    <div className='wallet-settings-wrapper'>
      <div className='wallet-settings'>
        <div className='header'>Wallet Settings</div>

        <div className='items'>
          <div className='add-wallet item'>
            <div className='title'>Add a Wallet</div>
            <div className='actions'>
              <div className='action'>Import from Seed Phrase</div>
              <div className='action'>Import from .JSON File</div>
              <div className='action'>Create New Wallet</div>
            </div>
          </div>

          <div className='default-currency item'>
            <div className='title'>Default Currency</div>
            <div className='description'>
              Select the exchange currency to display next to tokens (currently,
              only fiat currencies are supported).
            </div>
            <select
              className='currency'
              onChange={onCurrencyChange}
              defaultValue='USD'
            >
              {data.map(({ code, currency }) => (
                <option key={code} value={code}>{`${
                  getSymbolFromCurrency(code) || ''
                } ${currency} (${code})`}</option>
              ))}
            </select>
          </div>

          <div className='display-order item'>
            <div className='title'>Display Order</div>
            <div className='description'>
              Organize your wallet display (click and drag a wallet to move it).
            </div>
          </div>

          <div className='language-order item'>
            <div className='title'>Language</div>
            <div className='description coming-soon'>
              Language options are coming soon!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
