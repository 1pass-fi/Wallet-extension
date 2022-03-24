// modules
import '@babel/polyfill'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Route, Switch, useHistory, withRouter } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'

// components
// import Header from 'components/header'
import Header from 'components/PopupHeader'
import Loading from 'components/loading'
import Account from 'components/accounts'
import Assets from 'components/assets'
import Activity from 'components/activity'
import Setting from 'components/setting'
import Message from 'components/message'
import SigningScreen from 'components/Signing/SigningScreen'

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
import { setActivatedChain } from 'actions/activatedChain'
import { setActivityNotifications } from 'actions/activityNotification'
import { setSettings } from 'actions/settings'
import { setActivities } from 'actions/activities'
import { setAssetsTabSettings } from 'actions/assetsSettings'

// hooks
import useAccountLoaded from './provider/hooks/useAccountLoaded'
import usePrice from './provider/hooks/usePrice'
import useSettings from './provider/hooks/useSettings'
import useLoadApp from './provider/hooks/useLoadApp'

// assets
import continueLoadingIcon from 'img/continue-load.gif'
import KoiLogo from 'img/koi-logo.svg'

// constants
import { PATH } from 'constants/koiConstants'

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
  setActivatedChain,
  accounts,
  setActivityNotifications,
  setSettings,
  activities,
  setActivities,
  setAssetsTabSettings
}) => {
  const [showSigning, setShowSigning] = useState(true)
  const history = useHistory()

  const [needToReconnect, setNeedToReconnect] = useState(false)

  const [accountLoaded, setAccountLoaded] = useAccountLoaded({
    history,
    setIsLoading,
    setAccounts,
    setActivatedChain
  })

  usePrice({
    setCurrency,
    setPrice,
    setError
  })

  useSettings({ setSettings, setAssetsTabSettings, setError })

  const [handleLockWallet] = useLoadApp({
    history,
    accountLoaded,
    setDefaultAccount,
    setActivityNotifications,
    setNeedToReconnect,
    setError,
    setIsLoading,
    accounts,
    lockWallet
  })

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
          {showSigning && <SigningScreen />}
          {isContLoading && location.pathname === '/assets' && <ContinueLoading />}
          {isLoading && <Loading />}
          {error && <Message type="error" children={error} />}
          {notification && <Message type="notification" children={notification} />}
          {warning && <Message type="warning" children={warning} />}
          {accountLoaded.accountLoaded && (
            <Switch>
              <Route exact path="/login">
                <Login />
              </Route>
              <Route exact path="/account/*">
                <Account />
              </Route>
              {!accountLoaded.isEmptyAccounts && (
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
              )}
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
  setActivatedChain,
  setActivityNotifications,
  setSettings,
  setActivities,
  setAssetsTabSettings
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Popup))
