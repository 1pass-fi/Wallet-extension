import React, { useEffect, useMemo, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import axios from 'axios'
import { TYPE } from 'constants/accountConstants'
import { OS, STORAGE } from 'constants/koiConstants'
import data from 'currency-codes/data'
import getSymbolFromCurrency from 'currency-symbol-map'
import { get, isEmpty } from 'lodash'
import { setError } from 'options/actions/error'
import { setQuickNotification } from 'options/actions/quickNotification'
import AccountCard from 'options/components/AccountCard'
import AccountManagement from 'options/components/AccountManagement'
import ConfirmRemoveAccountModal from 'options/components/AccountManagement/ConfirmRemoveAccountModal'
import ConnectedSitesModal from 'options/components/ConnectedSitesModal'
import DropDown from 'options/components/DropDown'
import OverwriteMetamaskModal from 'options/components/OverwriteMetamaskModal'
import { GalleryContext } from 'options/galleryContext'
import storage from 'services/storage'
import { getChromeStorage, isSolanaAddress, setChromeStorage } from 'utils'

import AddNetworkManuallyModal from './AddNetworkManuallyModal'
import AcceptedCurrencies from './currencies'
import EvmNetworks from './EvmNetworks'

import './index.css'

const mockedWalletDisplayOptions = [{ value: 'accountsummary', label: 'Account Summary' }]

export default () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const locationId = queryParams.get('locationId')

  const [currency, setCurrency] = useState('USD')
  const [chainOption, setChainOption] = useState('ALL')
  const [showConfirmRemoveAccount, setShowConfirmRemoveAccount] = useState(false)
  const [showConnectedSites, setShowConnectedSites] = useState(false)
  const [showAddNetworkManually, setShowAddNetworkManually] = useState(false)
  const [accountConnectSites, setAccountConnectSites] = useState({})
  const [removeAccount, setRemoveAccount] = useState({})
  const [listAccounts, setListAccounts] = useState([])
  const [showOverwriteMetamask, setShowOverwriteMetamask] = useState(false)

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

  const chainOptions = [
    { label: chrome.i18n.getMessage('allAccounts'), value: 'ALL' },
    { label: 'K2 ' + chrome.i18n.getMessage('account'), value: TYPE.K2 },
    { label: 'EVM ' + chrome.i18n.getMessage('account'), value: TYPE.ETHEREUM },
    { label: 'Solana ' + chrome.i18n.getMessage('account'), value: TYPE.SOLANA },
    { label: 'Arweave ' + chrome.i18n.getMessage('account'), value: TYPE.ARWEAVE }
  ]

  useEffect(() => {
    const getCurrency = async () => {
      const storage = await getChromeStorage(STORAGE.CURRENCY)
      const storedCurrency = storage[STORAGE.CURRENCY] || 'USD'
      setCurrency(storedCurrency)
    }

    getCurrency()
  }, [])

  useEffect(() => {
    if (locationId === 'add-network') {
      const element = document.getElementById(locationId)
      window.scrollTo({
        top: element.offsetTop,
      })
    }
  }, [locationId])

  const onImportSeedPhrase = () => {
    history.push('/import-wallet')
  }

  const onImportJsonFile = () => {
    history.push('/upload-json')
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
        dispatch(setError(`${chrome.i18n.getMessage('getArPriceError')} + ${currency}.`))
        setCurrency('USD')
      } else {
        setCurrency(currency)
        await setChromeStorage({ [STORAGE.CURRENCY]: currency })
        // set value for new storage object
        await storage.setting.set.selectedCurrency(currency)
        dispatch(
          setQuickNotification(`${chrome.i18n.getMessage('defaultCurrency')} + ${currency}.`)
        )
      }
    } catch (err) {
      console.log(err.message)
      dispatch(setError(err.message))
    }
  }

  useEffect(() => {
    if (chainOption !== 'ALL') {
      const showAccountList = accounts.filter((account) => account.type.includes(chainOption))
      setListAccounts(showAccountList)
    } else {
      setListAccounts(accounts)
    }
  }, [chainOption, accounts])

  const onChainOption = (chain) => {
    setChainOption(chain)
  }

  const reorder = (list, startIndex, endIndex) => {
    try {
      const result = Array.from(list)
      const [removed] = result.splice(startIndex, 1)
      result.splice(endIndex, 0, removed)

      return result
    } catch (err) {
      console.error('reorder - Error: ', err.message)
    }
  }

  const onDragEnd = (result) => {
    try {
      if (!result.destination) {
        return
      }

      if (result.destination.index === result.source.index) {
        return
      }

      const listAccountsAfterDrag = reorder(
        listAccounts,
        result.source.index,
        result.destination.index
      )

      setListAccounts(listAccountsAfterDrag)
    } catch (error) {
      console.error('onDragEnd - Error: ', error.message)
    }
  }

  const onClickSeeListOfSites = () => {
    setShowOverwriteMetamask(true)
  }

  return (
    <div className="wallet-settings-wrapper">
      <div className="wallet-settings">
        <div className="header">{chrome.i18n.getMessage('walletSettings')}</div>
        <div className="mt-10 pl-5">
          <div className="add-wallet pb-2 mb-4 border-b border-white">
            <div className="font-semibold text-base 2xl:text-lg 3xl:text-xl leading-8 uppercase">
              {chrome.i18n.getMessage('addAKey')}
            </div>
            <div className="flex gap-6.75 my-1">
              <div
                className="bg-success rounded-sm text-center text-indigo text-sm 2xl:text-base 3xl:text-lg leading-4 font-normal flex justify-center items-center mr-6.75 cursor-pointer"
                style={{ width: '220px', height: '38px' }}
                onClick={onCreateWallet}
                data-testid="setting-create-wallet"
                role="button"
              >
                {chrome.i18n.getMessage('createANewKey')}
              </div>
              <div
                className="bg-trueGray-100 rounded-sm text-center text-indigo text-sm 2xl:text-base 3xl:text-lg leading-4 font-normal flex justify-center items-center cursor-pointer"
                style={{ width: '220px', height: '38px' }}
                onClick={onImportSeedPhrase}
                data-testid="setting-import-wallet"
                role="button"
              >
                {chrome.i18n.getMessage('importWithPhrase')}
              </div>
            </div>
            {/* <div
              className="mt-2.5 font-normal text-xs 2xl:text-sm 3xl:text-base underline tracking-finnieSpacing-wide text-lightBlue cursor-pointer"
              onClick={onImportKeyFile}
            >
              Import a JSON file.
            </div> */}
          </div>

          <div className="default-currency pb-6 mb-4 border-b border-white">
            <div className="font-semibold text-base 2xl:text-lg 3xl:text-xl leading-8 uppercase">
              {chrome.i18n.getMessage('defaultCurrency')}
            </div>
            <div className="text-sm 2xl:text-base 3xl:text-lg leading-6 mb-1">
              {chrome.i18n.getMessage('selectExchangeCurrency')}
            </div>
            <div className="text-xs 2xl:text-sm 3xl:text-base leading-4 mb-4.5 text-lightBlue">
              {chrome.i18n.getMessage('fiatCurrenciesSupport')}
            </div>
            <div style={{ width: '300px' }}>
              <DropDown
                options={currenciesData}
                value={currency}
                onChange={onCurrencyChange}
                variant="dark"
                size="lg"
                filterSupported={false}
              />
            </div>
          </div>

          {/* METAMASK OVERWRITES */}
          <div className="default-currency pb-6 mb-4 border-b border-white">
            <div className="font-semibold text-base 2xl:text-lg 3xl:text-xl leading-8 uppercase">
              {chrome.i18n.getMessage('metamaskOverwrites')}
            </div>
            <div className="text-sm 2xl:text-base 3xl:text-lg leading-6 mb-1">
              {chrome.i18n.getMessage('selectWhichWalletYouWish')}
            </div>
            <div className="text-xs 2xl:text-sm 3xl:text-base leading-4 mb-4.5 text-lightBlue">
              {chrome.i18n.getMessage('youCanChangeThisSetting')}
            </div>
            <div
              className="bg-success rounded-sm text-center text-indigo text-sm 2xl:text-base 3xl:text-lg leading-4 font-normal flex justify-center items-center mr-6.75 cursor-pointer"
              style={{ width: '220px', height: '38px' }}
              onClick={onClickSeeListOfSites}
              data-testid="setting-see-list-of-sites"
              role="button"
            >
              {chrome.i18n.getMessage('seeListOfSites')}
            </div>
          </div>

          {/* KEY DETAILS */}
          <div className="display-order pb-6 mb-4 border-b border-white">
            <div className="font-semibold text-base 2xl:text-lg 3xl:text-xl leading-8 uppercase">
              {chrome.i18n.getMessage('keyDetails')}
            </div>
            <div className="text-sm 2xl:text-base 3xl:text-lg leading-6 mb-4.5">
              {chrome.i18n.getMessage('organizeWalletDisplay')}
            </div>
            <div className="mb-1.5" style={{ width: '270px' }}>
              <DropDown
                options={chainOptions}
                value={chainOption}
                onChange={onChainOption}
                variant="dark"
                size="lg"
                filterSupported={false}
              />
            </div>
            {listAccounts.map((account, index) => (
              <AccountCard
                key={account.address}
                account={account}
                setShowConfirmRemoveAccount={setShowConfirmRemoveAccount}
                setRemoveAccount={setRemoveAccount}
                setShowConnectedSites={setShowConnectedSites}
                setAccountConnectSites={setAccountConnectSites}
              />
            ))}
          </div>

          {/* ADD EVM NETWORKS */}
          <div id='add-network' className="default-currency pb-6 mb-4 border-b border-white">
            <div className="font-semibold text-base 2xl:text-lg 3xl:text-xl leading-8 uppercase">
              Add EVM Networks
            </div>
            <div className="text-sm 2xl:text-base 3xl:text-lg leading-6 mb-7">
              Add from a list of popular networks or add a network manually. Only interact with the entities you trust.
            </div>
            <div>
              <EvmNetworks />
            </div>
            <div
              className="bg-success rounded-sm text-center text-indigo text-sm 2xl:text-base 3xl:text-lg leading-4 font-normal flex justify-center items-center mr-6.75"
              style={{ width: '220px', height: '38px' }}
              data-testid="setting-see-list-of-sites"
              role="button"
              onClick={() => setShowAddNetworkManually(true)}
            >
              Add Network Manually
            </div>
          </div>

          {/* IMPORT JSON */}
          <div onClick={onImportJsonFile} style={{color:'#8989C7'}} className='underline mb-8 text-base font-semibold cursor-pointer'>
            Import a key file.
          </div>
        </div>
      </div>

      {showConfirmRemoveAccount && (
        <ConfirmRemoveAccountModal
          account={removeAccount}
          close={() => setShowConfirmRemoveAccount(false)}
        />
      )}

      {showConnectedSites && (
        <ConnectedSitesModal
          account={accountConnectSites}
          close={() => setShowConnectedSites(false)}
        />
      )}

      {showOverwriteMetamask && (
        <OverwriteMetamaskModal
          close={() => setShowOverwriteMetamask(false)}
        />
      )}

      {showAddNetworkManually && <AddNetworkManuallyModal account={accounts[0]} close={() => setShowAddNetworkManually(false)}/>}
    </div>
  )
}
