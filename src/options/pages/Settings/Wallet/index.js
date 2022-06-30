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
import AccountCard from 'finnie-v2/components/AccountCard'

import './index.css'

const mockedWalletDisplayOptions = [{ value: 'accountsummary', label: 'Account Summary' }]

export default () => {
  const history = useHistory()
  const { setError, setNotification } = useContext(GalleryContext)

  const [currency, setCurrency] = useState('USD')
  /* TODO DatH */
  const [chainOption, setChainOption] = useState('All')
  const [showConfirmRemoveAccount, setShowConfirmRemoveAccount] = useState(false)
  const [removeAccount, setRemoveAccount] = useState({})

  const accounts = useSelector((state) => state.accounts)
  console.log('List accounts', accounts)

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

  /* TODO DatH */
  const chainOptions = [
    { label: 'All Accounts', value: 'All' },
    { label: 'B', value: 'B' },
    { label: 'C', value: 'C' }
  ]

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

  /* TODO DatH */
  const onChainOption = (chain) => {
    console.log('onChainOption', chain)
    setChainOption(chain)
  }

  return (
    <div className="wallet-settings-wrapper">
      <div className="wallet-settings">
        <div className="header">Wallet Settings</div>
        <div className="mt-10 pl-5">
          <div className="add-wallet pb-2 mb-4 border-b border-white">
            <div className="font-semibold text-base leading-8 uppercase">Add a Wallet</div>
            <div className="flex gap-6.75">
              <div
                className="bg-success rounded-sm text-center text-indigo text-sm leading-4 font-normal flex justify-center items-center mr-6.75 cursor-pointer"
                style={{ width: '220px', height: '38px' }}
                onClick={onCreateWallet}
              >
                Create New Wallet
              </div>
              <div
                className="bg-trueGray-100 rounded-sm text-center text-indigo text-sm leading-4 font-normal flex justify-center items-center cursor-pointer"
                style={{ width: '220px', height: '38px' }}
                onClick={onImportSeedPhrase}
              >
                Import with Phrase
              </div>
            </div>
            <div
              className="mt-2.5 font-normal text-xs underline tracking-finnieSpacing-wide text-lightBlue cursor-pointer"
              onClick={onImportKeyFile}
            >
              Import a JSON file.
            </div>
          </div>

          <div className="default-currency pb-6 mb-4 border-b border-white">
            <div className="font-semibold text-base leading-8 uppercase">Default Currency</div>
            <div className="text-sm leading-6 mb-1">
              Select the exchange currency displayed next to your tokens and transactions.
            </div>
            <div className="text-xs leading-4 mb-4.5 text-lightBlue">
              We can only show the exchange rate for fiat currencies at this time.
            </div>
            <div style={{ width: '270px' }}>
              <DropDown
                options={currenciesData}
                value={currency}
                onChange={onCurrencyChange}
                variant="dark"
                size="lg"
              />
            </div>
          </div>

          <div className="display-order pb-6 mb-4 border-b border-white">
            <div className="font-semibold text-base leading-8 uppercase">Key Details</div>
            <div className="text-sm leading-6 mb-4.5">
              Organize your wallet display and select a default key. This key will be automatically
              selected to create NFTs and send tokens.
            </div>
            <div className="mb-1.5" style={{ width: '270px' }}>
              <DropDown
                options={chainOptions}
                value={chainOption}
                onChange={onChainOption}
                variant="dark"
                size="lg"
              />
            </div>

            {accounts.map((account, index) => (
              <AccountCard type={account.type} key={index} />
            ))}
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
