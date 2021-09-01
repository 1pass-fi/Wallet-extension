import React, { useState, useContext, useRef, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import data from 'currency-codes/data'
import getSymbolFromCurrency from 'currency-symbol-map'
import { isEmpty, get } from 'lodash'
import axios from 'axios'

import { getChromeStorage, setChromeStorage } from 'utils'
import { STORAGE, OS } from 'constants/koiConstants'
import { GalleryContext } from 'options/galleryContext'

import AccountOrder from './AccountOrder'
import './index.css'
import AcceptedCurrencies from './currencies'

import storage from 'services/storage'

export default () => {
  const history = useHistory()
  const { setError, setNotification, wallets, setWallets } = useContext(GalleryContext)

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

  const onImportSeedPhrase = () => {
    history.push('/import-wallet')
  }
  
  const onImportKeyFile = () => {
    history.push('/upload-wallet')
  }
  
  const onCreateWallet = () => {
    history.push('/create-wallet')
  }

  const onCurrencyChange = async (e) => {
    try {
      const currency = e.target.value
      console.log(currency)
      // Fetch to check if we can get AR price in this currency
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${currency}`
      )
      const price = get(response, 'data.arweave')
      if (!price || isEmpty(price)) {
        setError(`We cannot get AR price for the currency ${currency}.`)
        setCurrency('USD')
        sellectCurrencyRef.current.value = 'USD'
      } else {
        setCurrency(currency)
        await setChromeStorage({ [STORAGE.CURRENCY]: currency })
        // set value for new storage object
        await storage.setting.set.selectedCurrency(currency)
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
          <div className='add-wallet item'>
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
          </div>

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
              {data
                .filter(({ code }) => AcceptedCurrencies.includes(code))
                .map(({ code, currency }) => (
                  <option style={{ color: textColor }} key={code} value={code}>
                    {`${
                      getSymbolFromCurrency(code) || ''
                    } ${currency} (${code})`}
                  </option>
                ))}
            </select>
          </div>


          <div className='display-order item'>
            <div className='title'>Wallet Priority</div>
            <div className='description'>
              Organize your wallet display (click and drag a wallet to move it).
            </div>
            <AccountOrder accounts={wallets} setAccounts={setWallets} />
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
