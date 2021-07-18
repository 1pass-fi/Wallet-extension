import React, { useState, useContext, useRef, useEffect } from 'react'
import data from 'currency-codes/data'
import getSymbolFromCurrency from 'currency-symbol-map'
import { isEmpty, get } from 'lodash'

import { getChromeStorage, setChromeStorage } from 'utils'
import { STORAGE, OS } from 'koiConstants'
import { GalleryContext } from 'options/galleryContext'

import AccountOrder from './AccountOrder'
import './index.css'
import axios from 'axios'

import storage from 'storage'

// const mockAccount = [
//   {
//     id: '1',
//     name: 'account #1',
//     address: '1234567890123456789012345678901234',
//   },
//   {
//     id: '2',
//     name: 'account #2',
//     address: '6789012341234567890123456789012345',
//   },
//   {
//     id: '3',
//     name: 'account #3',
//     address: '1234567890123456789012345679999999',
//   },
// ]

const onImportSeedPhrase = () => {
  // Import seed phrase
}

const onImportKeyFile = () => {
  // Import key file
}

const onCreateWallet = () => {
  // Import create wallet
}

export default () => {
  const { setError, setNotification } = useContext(GalleryContext)
  const [currency, setCurrency] = useState('USD')
  const [textColor, setTextColor] = useState('#ffffff')

  const sellectCurrencyRef = useRef()

  useEffect(() => {
    const getCurrency = async () => {
      const storage = await getChromeStorage(STORAGE.CURRENCY)
      const currency = storage[STORAGE.CURRENCY] || 'USD'
      sellectCurrencyRef.current.value = currency
    }

    const getOs = () => {
      const os = window.localStorage.getItem(OS)
      if (os == 'win') setTextColor('#171753')
    }

    getCurrency()
    getOs()
  }, [])

  const onCurrencyChange =  async (e) => {
    try {
      const currency = e.target.value
      console.log(currency)
      // Fetch to check if we can get AR price in this currency
      const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${currency}`)
      const price = get(response, 'data.arweave')
      if (!price || isEmpty(price)) {
        setError(`We cannot get AR price for the currency ${currency}.`)
        setCurrency('USD')
        sellectCurrencyRef.current.value = 'USD'
      } else {
        setCurrency(currency)
        await setChromeStorage({ [STORAGE.CURRENCY]: currency })
        // set value for new storage object
        await storage.generic.set.selectedCurrency(currency)
        setNotification(`Succesfully set currency to ${currency}.`)
      }
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    }
  }

  // const [accounts, setAccounts] = useState(mockAccount)

  return (
    <div className='wallet-settings-wrapper'>
      <div className='wallet-settings'>
        <div className='header'>Wallet Settings</div>

        <div className='items'>

          {/* 
            Currently we can import only one wallet. This will hide for now.
          */}
          {/* <div className='add-wallet item'>
            <div className='title'>Add a Wallet</div>
            <div className='actions'>
              <div className='action' onClick={onImportSeedPhrase}>
                Import from Seed Phrase
              </div>
              <div className='action' onClick={onImportKeyFile}>
                Import from .JSON File
              </div>
              <div className='action' onClick={onCreateWallet}>
                Create New Wallet
              </div>
            </div>
          </div> */}

          <div className='default-currency item'>
            <div className='title'>Default Currency</div>
            <div className='description'>
              Select the exchange currency to display next to tokens (currently,
              only fiat currencies are supported).
            </div>
            <select
              ref={sellectCurrencyRef}
              className='currency'
              onChange={onCurrencyChange}
              defaultValue={currency}
            >
              {data.map(({ code, currency }) => (
                <option style={{color: textColor}} key={code} value={code}>{`${
                  getSymbolFromCurrency(code) || ''
                } ${currency} (${code})`}</option>
              ))}
            </select>
          </div>

          {/* 
            Currently we can import only one wallet. This will hide for now.
          */}
          {/* <div className='display-order item'>
            <div className='title'>Display Order</div>
            <div className='description'>
              Organize your wallet display (click and drag a wallet to move it).
            </div>
            <AccountOrder accounts={accounts} setAccounts={setAccounts} />
          </div> */}

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
