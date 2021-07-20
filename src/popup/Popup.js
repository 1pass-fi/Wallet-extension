import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import { get, isNumber } from 'lodash'

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

import { HEADER_EXCLUDE_PATH, REQUEST, DISCONNECTED_BACKGROUND } from 'koiConstants'


import axios from 'axios'

import storage from 'storage'

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
  setCurrency
}) => {
  const history = useHistory()

  const [needToReconnect, setNeedToReconnect] = useState(false)

  const loadApp = async () => {
    /* 
      Load data for redirecting
        - Address
        - Key
        - Pending Request
    */

    const address = await storage.arweaveWallet.get.address()
    const key = await storage.arweaveWallet.get.key()
    const pendingRequest = await storage.generic.get.pendingRequest()

    // get ethereum wallet
    const ethAddress = await storage.ethereumWallet.get.address()
    const ethKey = await storage.ethereumWallet.get.key()

    console.log('address: ', address)
    console.log('key: ', key)
    console.log('pendingRequest: ', pendingRequest)
    const query = window.location.search // later we should refactor using react-hash-router
    try {
      if (address || ethAddress) {
        setKoi({ address })
        setEthereum({ ethAddress, ethBalance: 0 })
        getBalances()
        switch (get(pendingRequest, 'type')) {
          case REQUEST.PERMISSION:
            history.push('/account/connect-site')
            break
          case REQUEST.TRANSACTION:
            history.push('/account/sign-transaction')
            break
          default:
            history.push('/account')
        }
      } else {
        // Koi Address not in local storage -> cannot get data of balances, assets, activities
        if (key) {
          history.push('/account/login')
        } else if (query.includes('create-wallet')) {
          history.push('/account/create')
        } else if (query.includes('upload-json')) {
          history.push('/account/import/keyfile')
        } else if (query.includes('upload-seedphrase')) {
          history.push('/account/import/phrase')
        } else {
          history.push('/account/welcome')
        }
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
  }, [error])

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  useEffect(() => {
    if (warning) {
      const timer = setTimeout(() => setWarning(null), 6000)
      return () => clearTimeout(timer)
    }
  }, [warning])

  const activities = [
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 100,
      accountName: 'Account 1',
      date: 'May 24, 2021'
    },
    {
      activityName: `Purchased "The Balance of Koi"`,
      expense: 200,
      accountName: 'Account 1',
      date: 'May 22, 2021'
    },
  ]

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
                  <Activity activities={activities} />
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
  price: state.price
})

const mapDispatchToProps = {
  setIsLoading,
  setError,
  setNotification,
  setWarning,
  setKoi,
  getBalances,
  setPrice,
  setCurrency
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
