import React, { useState, useContext, useMemo, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import axios from 'axios'
import data from 'currency-codes/data'
import getSymbolFromCurrency from 'currency-symbol-map'
import { isEmpty, get } from 'lodash'

import { getChromeStorage, setChromeStorage, isSolanaAddress } from 'utils'
import { STORAGE, OS } from 'constants/koiConstants'
import { GalleryContext } from 'options/galleryContext'
import storage from 'services/storage'

// import AccountOrder from './AccountOrder'
import AcceptedCurrencies from './currencies'

import AccountManagement from 'finnie-v2/components/AccountManagement'
import ConfirmRemoveAccountModal from 'finnie-v2/components/AccountManagement/ConfirmRemoveAccountModal'
import DropDown from 'finnie-v2/components/DropDown'

import './index.css'

const mockedWalletDisplayOptions = [{ value: 'accountsummary', label: 'Account Summary' }]

export default () => {
  const history = useHistory()
  const { setError, setNotification } = useContext(GalleryContext)

  const [currency, setCurrency] = useState('USD')
  const [showConfirmRemoveAccount, setShowConfirmRemoveAccount] = useState(false)
  const [removeAccount, setRemoveAccount] = useState({})

  const accounts = useSelector((state) => state.accounts)

  const currenciesData = useMemo(
    () =>
      data
        .filter(({ code }) => AcceptedCurrencies.includes(code))
        .map(({ code, currency }) => ({
          label: `${getSymbolFromCurrency(code) || ''} ${currency} (${code})`,
          value: code
        })),
    [data]
  )

  useEffect(() => {
    const getCurrency = async () => {
      const storage = await getChromeStorage(STORAGE.CURRENCY)
      const storedCurrency = storage[STORAGE.CURRENCY] || 'USD'
      setCurrency(storedCurrency)
    }

    getCurrency()
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

  const onCurrencyChange = async (currency) => {
    try {
      // Fetch to check if we can get AR price in this currency
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${currency}`
      )
      const price = get(response, 'data.arweave')
      if (!price || isEmpty(price)) {
        setError(`We cannot get AR price for the currency ${currency}.`)
        setCurrency('USD')
      } else {
        setCurrency(currency)
        await setChromeStorage({ [STORAGE.CURRENCY]: currency })
        // set value for new storage object
        await storage.setting.set.selectedCurrency(currency)
        setNotification(`Default currency set to ${currency}.`)
      }
    } catch (err) {
      console.log(err.message)
      setError(err.message)
    }
  }

  return (
    <div className="wallet-settings-wrapper">
      <div className="wallet-settings">
        <div className="header">Wallet Settings</div>

        <div className="items">
          <div className="add-wallet item">
            <div className="title">Add a Wallet</div>
            <div className="actions">
              <div className="action action--seed-phrase" onClick={onImportSeedPhrase}>
                Import Seed Phrase
              </div>
              <div className="action action--json" onClick={onImportKeyFile}>
                Import .JSON File
              </div>
              <div className="action action--create-new" onClick={onCreateWallet}>
                Create New Wallet
              </div>
            </div>
          </div>

          <div className="default-currency item">
            <div className="title">Default Currency</div>
            <div className="description">
              Select the exchange currency displayed next to your tokens and transactions.
            </div>
            <div className="notes">
              We can only show the exchange rate for fiat currencies at this time.
            </div>
            <div className="default-currency__dropdown">
              <DropDown
                options={currenciesData}
                value={currency}
                onChange={onCurrencyChange}
                variant="dark"
                size="lg"
              />
            </div>
          </div>

          <div className="display-order item">
            <div className="title">Wallet Priority</div>
            <div className="description">
              Organize your wallet display and select a default key. This key will be automatically
              selected to create NFTs and send tokens.
            </div>
            {/* <AccountOrder accounts={accounts} setAccounts={() => {}} /> */}
            <AccountManagement
              accounts={accounts}
              setShowConfirmRemoveAccount={setShowConfirmRemoveAccount}
              setRemoveAccount={setRemoveAccount}
            />
          </div>

          {/* Still in use */}
          {/* <div className="default-currency item">
            <div className="title">Wallet display</div>
            <div className="description">
              Select a wallet or your account summary as the default when opening the Finnie
              extension.
            </div>
            <div className="default-currency__dropdown">
              <DropDown
                options={mockedWalletDisplayOptions}
                value={mockedWalletDisplayOptions[0].value}
                onChange={() => {}}
                variant="dark"
                size="lg"
              />
            </div>
          </div> */}

          <div className="language-order item">
            <div className="title">Language</div>
            <div className="description coming-soon">Language options are coming soon!</div>
          </div>
        </div>
      </div>

      {showConfirmRemoveAccount && (
        <ConfirmRemoveAccountModal
          account={removeAccount}
          close={() => setShowConfirmRemoveAccount(false)}
        />
      )}
    </div>
  )
}
