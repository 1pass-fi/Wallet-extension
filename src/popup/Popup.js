// modules
import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import axios from 'axios'
import { get, isNumber, isEmpty } from 'lodash'

// components
// import Header from 'components/header'
import Header from 'components/PopupHeader'
import Loading from 'components/loading'
import Account from 'components/accounts'
import Assets from 'components/assets'
import Activity from 'components/activity'
import Setting from 'components/setting'
import Message from 'components/message'

// pages
import Home from './pages/Home'
import Receive from './pages/Receive'
import Send from './pages/Send'
import Login from './pages/Login'

// actions
import { lockWallet } from 'actions/koi'
import { setIsLoading } from 'actions/loading'
import { setError } from 'actions/error'
import { setNotification } from 'actions/notification'
import { setWarning } from 'actions/warning'
import { setPrice } from 'actions/price'
import { setKoi, getBalances } from 'actions/koi'
import { setCurrency } from 'actions/currency'
import { setAccounts } from 'actions/accounts'
import { setDefaultAccount } from 'actions/defaultAccount'
import { setActivityNotifications } from 'actions/activityNotification'
import { setSettings } from 'actions/settings'
import { setActivities } from 'actions/activities'
import { setAssetsTabSettings } from 'actions/assetsSettings'

// assets
import continueLoadingIcon from 'img/continue-load.gif'
import KoiLogo from 'img/koi-logo.svg'

// services
import storage from 'services/storage'
import { popupBackgroundRequest as backgroundRequest } from 'services/request/popup'
import { popupAccount } from 'services/account'

// constants
import { HEADER_EXCLUDE_PATH, REQUEST, DISCONNECTED_BACKGROUND, PATH } from 'constants/koiConstants'
import { SHOW_ACTIVITIES_BY } from 'constants/storageConstants'

// styles
import './Popup.css'
import NavBar from './components/NavBar'

const ContinueLoading = () => (
  <div className="continue-loading">
    <img src={continueLoadingIcon} />
  </div>
)

const Reconnect = () => (
  <div className="reconnect">
    <div className="reconnect-logo">
      <KoiLogo />
    </div>
    Finnie needs to reconnect to the background. Please click on the button below.
    <button onClick={() => chrome.runtime.reload()}>Reconnect</button>
  </div>
)

const Popup = ({
  lockWallet,
  location,
  isLoading,
  isContLoading,
  setIsLoading,
  error,
  setError,
  notification,
  setNotification,
  warning,
  getBalances,
  setPrice,
  setKoi,
  setCurrency,
  setAccounts,
  setDefaultAccount,
  accounts,
  setActivityNotifications,
  setSettings,
  activities,
  setActivities,
  setAssetsTabSettings
}) => {
  const history = useHistory()

  const [needToReconnect, setNeedToReconnect] = useState(false)
  const [accountLoaded, setAccountLoaded] = useState(false)

  const loadApp = async () => {
    setIsLoading(true)
    /* 
      load for wallet state of lock or unlock
      load for all accounts
    */
    await popupAccount.loadImported()
    let accounts = await popupAccount.getAllMetadata()

    const isLocked = await backgroundRequest.wallet.getLockState()

    setAccounts(accounts)
    setAccountLoaded(true)
    setIsLoading(false)

    if (isEmpty(accounts)) {
      history.push('/account/welcome')
    }

    const activatedAccountAddress = await storage.setting.get.activatedAccountAddress()
    const activatedAccount = await popupAccount.getAccount({
      address: activatedAccountAddress
    })

    const activatedAccountMetadata = await activatedAccount.get.metadata()
    setDefaultAccount(activatedAccountMetadata)

    const query = window.location.search // later we should refactor using react-hash-router

    /* 
      Load for activity notifications
    */
    const _activityNotifications = (await storage.generic.get.activityNotifications()) || []
    setActivityNotifications(_activityNotifications)

    /* 
      Load for pending request
    */
    const pendingRequest = await storage.generic.get.pendingRequest()

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

      if (!isEmpty(accounts) && isLocked) {
        history.push('/login')
      } else {
        if (pendingRequest) {
          switch (pendingRequest.type) {
            case REQUEST.PERMISSION:
              history.push(PATH.CONNECT_SITE)
              break
            case REQUEST.TRANSACTION:
              history.push(PATH.SIGN_TRANSACTION)
          }
        }
      }

      if (query.includes('create-wallet')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/create?type=${walletType}`)
      } else if (query.includes('upload-json')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/keyfile?type=${walletType}`)
      } else if (query.includes('upload-seedphrase')) {
        const params = new URLSearchParams(query)
        const walletType = params.get('type')
        history.push(`/account/import/phrase?type=${walletType}`)
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
      const price = await storage.generic.get.tokenPrice()
      let selectedCurrency = (await storage.setting.get.selectedCurrency()) || 'USD'

      console.log('Selected Currency: ', selectedCurrency)

      const { AR, ETH } = price || 1

      setPrice({ AR, ETH })
      setCurrency(selectedCurrency)

      const { data: responseData } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=${selectedCurrency}`
      )
      console.log('currency: ', selectedCurrency)
      console.log('price', responseData)

      const arPrice = get(responseData, `arweave.${selectedCurrency.toLowerCase()}`)

      const { data: ethRes } = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${selectedCurrency}`
      )
      const ethPrice = get(ethRes, `ethereum.${selectedCurrency.toLowerCase()}`)

      if (isNumber(arPrice) && isNumber(arPrice)) {
        await setPrice({ AR: arPrice, ETH: ethPrice })
        await storage.generic.set.tokenPrice({ ...price, AR: arPrice, ETH: ethPrice })
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const loadSettings = async () => {
    try {
      const showActivitiesBy =
        (await storage.setting.get.showActivitiesBy()) || SHOW_ACTIVITIES_BY.ALL_ACCOUNTS
      const accountsToShowOnActivities =
        (await storage.setting.get.accountsToShowOnActivities()) || []
      const payload = {
        showAllAccounts: showActivitiesBy == SHOW_ACTIVITIES_BY.ALL_ACCOUNTS,
        accountsToShowOnActivities
      }
      setSettings(payload)
    } catch (err) {
      console.log(err.message)
    }
  }

  const loadAssetsTabSettings = async () => {
    try {
      const assetsTabSettings = await storage.setting.get.assetsTabSettings()

      setAssetsTabSettings(assetsTabSettings)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleLockWallet = async () => {
    if (!isEmpty(accounts)) {
      setIsLoading(true)
      await lockWallet()
      setIsLoading(false)

      history.push(PATH.LOGIN)

      chrome.tabs.query({ url: chrome.extension.getURL('*') }, (tabs) => {
        tabs.map((tab) => chrome.tabs.reload(tab.id))
      })
    } else {
      setError('Cannot lock wallet.')
    }
  }

  useEffect(() => {
    const load = async () => {
      loadPrice()
      loadAssetsTabSettings()
      await loadApp()
      await loadSettings()
    }

    load()
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

  return (
    <div className="popup">
      {needToReconnect ? (
        <Reconnect />
      ) : (
        <div className="h-full">
          {isContLoading && location.pathname === '/assets' && <ContinueLoading />}
          {isLoading && <Loading />}
          {error && <Message type="error" children={error} />}
          {notification && <Message type="notification" children={notification} />}
          {warning && <Message type="warning" children={warning} />}
          {accountLoaded && (
            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/account/*">
                <Account />
              </Route>
              <>
                <Header />
                <div
                  className="flex min-h-3.375 pt-13.5 overflow-y-auto overflow-x-hidden"
                  style={{ height: 'calc(100% - 64px)' }}
                >
                  <Switch>
                    <Route exact path="/receive">
                      <Receive />
                    </Route>
                    <Route exact path="/send">
                      <Send />
                    </Route>
                    <Route path="*">
                      <Home />
                    </Route>
                  </Switch>
                </div>
                <NavBar handleLockWallet={handleLockWallet} />
              </>
            </Switch>
          )}
        </div>
      )}
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
  accounts: state.accounts,
  defaultAccount: state.defaultAccount,
  activityNotifications: state.activityNotifications,
  activities: state.activities
})

const mapDispatchToProps = {
  lockWallet,
  setIsLoading,
  setError,
  setNotification,
  setWarning,
  setKoi,
  getBalances,
  setPrice,
  setCurrency,
  setAccounts,
  setDefaultAccount,
  setActivityNotifications,
  setSettings,
  setActivities,
  setAssetsTabSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
