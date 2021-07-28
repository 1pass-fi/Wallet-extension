import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import { get, isNumber, isEmpty } from 'lodash'

import './Popup.css'
import Header from 'components/header'
import Loading from 'components/loading'
import Account from 'components/accounts'
import Assets from 'components/assets'
import Activity from 'components/activity'
import Setting from 'components/setting'
import Message from 'components/message'
import continueLoadingIcon from 'img/continue-load.gif'

import KoiLogo from 'img/koi-logo.svg'

import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setNotification } from 'actions/notification'
import { setWarning } from 'actions/warning'
import { setPrice } from 'actions/price'
import { setKoi, getBalances } from 'actions/koi'
import { setCurrency } from 'actions/currency'
import { setEthereum } from 'actions/ethereum'
import { setAccounts } from 'actions/accounts'

import { HEADER_EXCLUDE_PATH, REQUEST, DISCONNECTED_BACKGROUND } from 'koiConstants'

import axios from 'axios'

import storage from 'storage'

import { Account as AccountClass } from 'account'

import { Ethereum } from 'background/eth'

const ContinueLoading = () => (
  <div className='continue-loading'>
    <img src={continueLoadingIcon} />
  </div>
)

const Reconnect = () => (
  <div className='reconnect'>
    <div className='reconnect-logo'><KoiLogo /></div>
      Finnie needs to reconnect to the background. Please click on the button below.
    <button onClick={() => chrome.runtime.reload()}>Reconnect</button>
  </div>
)

const Popup = ({
  location,
  isLoading,
  isContLoading,
  setIsLoading,
  error,
  setError,
  notification,
  setNotification,
  warning,
  setWarning,
  getBalances,
  setPrice,
  setKoi,
  setCurrency,
  setAccounts
}) => {
  const history = useHistory()

  const [needToReconnect, setNeedToReconnect] = useState(false)

  const loadApp = async () => {
    /* 
      load for wallet state of lock or unlock
      load for all accounts
    */
    let accounts = await AccountClass.getAll()
    let unlocked = await storage.generic.get.unlocked()
    accounts = await Promise.all(accounts.map(async account => await account.get.getAllFields()))
    
    unlocked = true
    setAccounts(accounts)


    const query = window.location.search // later we should refactor using react-hash-router

    /* 
      When there's no imported account, redirect to welcome screen
      If not unlocked, redirect to lock screen
      Click on add account, go to welcome screen
    */
    try {
      if (isEmpty(accounts)) {
        history.push('/account/welcome')
      } else {
        history.push('/account')
      }

      if (!unlocked) {
        history.push('/account/login')
      }

      if (query.includes('create-wallet')) {
        history.push('/account/create')
      } else if (query.includes('upload-json')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/keyfile?type=${walletType}`)
      } else if (query.includes('upload-seedphrase')) {
        history.push('/account/import/phrase')
      }
    } catch (err) {
      console.log(err.message)
      if (err.message === DISCONNECTED_BACKGROUND) {
        setNeedToReconnect(true)
      } else {
        setError(err.message)
      }
      setIsLoading(false)
    }
  }

  const loadPrice = async () => {
    try {
      const price = await storage.arweaveWallet.get.price()
      let selectedCurrency = await storage.setting.get.selectedCurrency() || 'USD'

      console.log('Selected Currency: ', selectedCurrency)

      const AR = price || 1

      setPrice({ AR })
      setCurrency(selectedCurrency)

      const { data: responseData } = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${selectedCurrency}`)
      console.log('currency: ', selectedCurrency)
      console.log('price', responseData)

      const arPrice = get(responseData, `arweave.${selectedCurrency.toLowerCase()}`)

      if (isNumber(arPrice)) {
        await setPrice({ AR: arPrice })
        await storage.arweaveWallet.set.price(arPrice)
      }
    } catch(err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    loadApp()
    loadPrice()
  }, [])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 4000)
      return () => clearTimeout(timer)
    }
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [error, notification, warning])

  // const test = async () => {
  //   const eth = new Ethereum()
  //   const wallet = eth.importWallet('program honey gym never cheap glance always come zebra slogan winner summer')
  //   console.log(wallet)
  // }

  return (
    <div className="popup">
      {
        needToReconnect ? <Reconnect /> :
          <div>
            {isContLoading && location.pathname === '/assets' && <ContinueLoading />}
            {isLoading && <Loading />}
            {error && <Message type='error' children={error} />}
            {notification && <Message type='notification' children={notification} />}
            {warning && <Message type='warning' children={warning} />}
            {!HEADER_EXCLUDE_PATH.includes(location.pathname) && <Header location={location} />}
            <div className='content'>
              <Switch>
                <Route path='/account'>
                  <Account />
                </Route>
                <Route path='/assets'>
                  <Assets />
                </Route>
                <Route path='/activity'>
                  <Activity />
                </Route>
                <Route path='/setting'>
                  <Setting />
                </Route>
              </Switch>
            </div>
          </div>
      }
    </div>
  )
}

const mapStateToProps = (state) => ({
  isLoading: state.loading,
  error: state.error,
  notification: state.notification,
  warning: state.warning,
  koi: state.koi,
  transactions: state.transactions,
  isContLoading: state.contLoading,
  price: state.price,
  accounts: state.accounts
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setNotification,
  setWarning,
  setKoi,
  getBalances,
  setPrice,
  setCurrency,
  setAccounts
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
